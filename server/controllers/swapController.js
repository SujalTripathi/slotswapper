const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');

// @desc    Get all swappable slots (events with status SWAPPABLE, not owned by current user)
// @route   GET /api/swaps/swappable
// @access  Private
const getSwappableSlots = async (req, res) => {
  try {
    const events = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: req.user._id }
    })
      .populate('userId', 'name email')
      .sort({ startTime: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new swap request
// @route   POST /api/swaps/request
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    // Validate both slots exist
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots not found' });
    }

    // Validate ownership
    if (mySlot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own the first slot' });
    }

    if (theirSlot.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot swap with your own slot' });
    }

    // Validate both are swappable
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
    }

    // Update both events to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    // Create swap request
    const swapRequest = await SwapRequest.create({
      mySlot: mySlotId,
      theirSlot: theirSlotId,
      requestingUser: req.user._id,
      targetUser: theirSlot.userId,
      status: 'PENDING'
    });

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requestingUser', 'name email')
      .populate('targetUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get my swap requests (incoming and outgoing)
// @route   GET /api/swaps/my-requests
// @access  Private
const getMySwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [
        { requestingUser: req.user._id },
        { targetUser: req.user._id }
      ]
    })
      .populate('requestingUser', 'name email')
      .populate('targetUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to swap request (accept/reject)
// @route   POST /api/swaps/respond/:id
// @access  Private
const respondToSwapRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('mySlot')
      .populate('theirSlot');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Verify the current user is the target user
    if (swapRequest.targetUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    if (action === 'accept') {
      // Exchange ownership
      const mySlot = await Event.findById(swapRequest.mySlot._id);
      const theirSlot = await Event.findById(swapRequest.theirSlot._id);

      const tempUserId = mySlot.userId;
      mySlot.userId = theirSlot.userId;
      theirSlot.userId = tempUserId;

      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';

      await mySlot.save();
      await theirSlot.save();

      swapRequest.status = 'ACCEPTED';
    } else {
      // Reject: reset both slots to SWAPPABLE
      const mySlot = await Event.findById(swapRequest.mySlot._id);
      const theirSlot = await Event.findById(swapRequest.theirSlot._id);

      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';

      await mySlot.save();
      await theirSlot.save();

      swapRequest.status = 'REJECTED';
    }

    await swapRequest.save();

    const updatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requestingUser', 'name email')
      .populate('targetUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSwappableSlots,
  createSwapRequest,
  getMySwapRequests,
  respondToSwapRequest,
};