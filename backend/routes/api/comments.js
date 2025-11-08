/**
 * @fileOverview Express router providing CRUD endpoints for Comment resources.
 * Uses the mongoose model named "Comment".
 *
 * Exports: Express Router mounted at /api/comments
 *
 * Routes:
 *  - GET    /api/comments/:id    -> Retrieve a single comment by its MongoDB ObjectId.
 *  - POST   /api/comments/       -> Create a new comment from request body.
 *  - PUT    /api/comments/:id    -> Update an existing comment by id with request body.
 *  - DELETE /api/comments/:id    -> Delete a comment by id.
 *
 * Common behavior:
 *  - All handlers are async and return JSON responses.
 *  - 404 is returned when a comment with the given id does not exist.
 *  - Validation or bad input typically results in 400.
 *  - Unexpected server errors result in 500.
 *
 * @module routes/api/comments
 *
 * @requires express.Router
 * @requires mongoose.model.Comment
 *
 * @typedef {Object} Request
 * @typedef {Object} Response
 *
 * @example
 * // GET successful response (200)
 * // {
 * //   "_id": "60f7e3c2a5e4f2b1c8d9e6f7",
 * //   "text": "A comment",
 * //   "author": "userId",
 * //   "createdAt": "2021-07-20T12:34:56.789Z",
 * //   ...
 * // }
 *
 * @route GET /api/comments/:id
 * @param {Request} req.params - route parameters
 * @param {string} req.params.id - Comment MongoDB ObjectId
 * @param {Response} res - Express response
 * @returns {Promise<void>} 200 with comment JSON | 404 if not found | 500 on server error
 *
 * @route POST /api/comments
 * @param {Request} req.body - New comment fields (shape validated by Comment model)
 * @param {Response} res - Express response
 * @returns {Promise<void>} 201 with created comment JSON | 400 on bad request
 *
 * @route PUT /api/comments/:id
 * @param {Request} req.params - route parameters
 * @param {string} req.params.id - Comment MongoDB ObjectId
 * @param {Request} req.body - Fields to update on the comment
 * @param {Response} res - Express response
 * @returns {Promise<void>} 200 with updated comment JSON | 404 if not found | 400 on bad request
 *
 * @route DELETE /api/comments/:id
 * @param {Request} req.params - route parameters
 * @param {string} req.params.id - Comment MongoDB ObjectId
 * @param {Response} res - Express response
 * @returns {Promise<void>} 200 with success message JSON | 404 if not found | 500 on server error
 */
const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = router;
// GET /api/comments/:id - Get a comment by ID
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// POST /api/comments - Create a new comment
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});
// PUT /api/comments/:id - Update a comment by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});
// DELETE /api/comments/:id - Delete a comment by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id).exec();
        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});