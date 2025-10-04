const router = require('express').Router
const noteController = require("../controllers/notesController")

router.route("/")
.get(noteController.getAllNotes)
.create(noteController.createNewNote)
.update(noteController.updateNote)
.delete(noteController.deleteNote)

module.exports = router
