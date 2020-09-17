/**
 * Function to create a new note from the input.
 * 
 * @param {HtmlElement} noteTitle Element containing the note title input.
 * @param {Object} noteContent  Element containing the note content input.
 * @param {Object} noteColor  Element containing the note color input.
 */
function createNewNote(noteTitle, noteContent, noteColor) {
    //Simple validation. If the title or content is empty, show an alert and do nothing.
    if (noteContent.value === '' && noteTitle.value === '') {
        alert("Can't add an empty note");
        return;
    }

    let newNote = createNote(noteTitle.value, noteContent.value, noteColor.value);
    let notesSection = document.querySelector("#notes");

    notesSection.insertBefore(newNote, notesSection.firstChild);

    //Reset the values of the input.
    noteTitle.value = '';
    noteContent.value = '';

    storeNotebook();
}

/**
 * Function to handle creating a new note.
 * @param {String} note_title Title of the new note.
 * @param {String} note_content Content of the new note.
 * @param {String} note_color Background color to use for the note.
 */
function createNote(noteTitle, noteContent, noteColor) {
    //Simple id generator, just use the current unix time.
    let id = Date.now().toString();

    let noteWrapper = document.createElement('note-wrapper');
    noteWrapper.id = id;
    noteWrapper.backgroundColor = noteColor;

    let newNote = document.createElement('notebook-note');
    newNote.id = id;
    newNote.title = noteTitle;
    newNote.text = noteContent;
    newNote.setCreatedTimestamp();

    noteWrapper.noteContent = newNote;
    noteWrapper.buttons = createLiveNoteModificationButtons(id);

    return noteWrapper;
}

/**
 * Function to delete an existing note from the notebook.
 * @param {String} id Note id.
 */
function deleteNote(id) {
    let confirmDelete = confirm("Delete this note?");
    if (confirmDelete) {
        let noteToDelete = document.querySelector("#note_" + id + "_wrapper");
        if (noteToDelete) {
            noteToDelete.remove();
        } else {
            console.error("Couldn't find the note with id " + id + " to delete.");
        }
    }
}

/**
 * Function to initiate the edit mode of an existing note.
 * @param {String} id Note id.
 */
function editNote(id) {
    let noteToEdit = document.querySelector("#note_" + id);
    if (noteToEdit) {
        noteToEdit.edit();
    } else {
        console.error("Couldn't initiate edit for note with id : " + id);
    }
}

/**
 * Function to save the content of a note which is being edited.
 * @param {String} id Note id.
 */
function saveNote(id) {
    let noteToSave = document.querySelector("#note_" + id);
    if (noteToSave) {
        noteToSave.save();
        storeNotebook();
    } else {
        console.error("Couldn't save note with id: " + id);
    }
}
/**
 * Function to cancel the edit of a note.
 * @param {String} id Note id.
 */

function cancelEdit(id) {
    let noteBeingEdited = document.querySelector("#note_" + id);
    if (noteBeingEdited) {
        noteBeingEdited.cancelEdit();
    } else {
        console.error("Couldn't cancel edit mode for note with id: " + id);
    }
}

/**
 * Create the buttons added to a note, which can be used for modification of the note.
 * @param {String} id Note id.
 */
function createLiveNoteModificationButtons(id) {
    let buttonDiv = document.createElement("note-buttons");
    buttonDiv.id = id;

    let editButton = document.createElement('edit-button');
    editButton.id = id;

    let deleteButton = document.createElement("delete-button");
    deleteButton.id = id;

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);

    return buttonDiv;
}

/**
 * Function to create the buttons added to a note while it is being edited, allowing us to save or cancel the edit.
 * @param {String} id Note id.
 */
function createLiveNoteEditButtons(id) {
    let buttonDiv = document.createElement("note-buttons");
    buttonDiv.id = id;

    let saveButton = document.createElement("save-button");
    saveButton.id = id;

    let cancelButton = document.createElement("cancel-button");
    cancelButton.id = id;

    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(cancelButton);

    return buttonDiv;
}

/**
 * Store the notebook in it's current state to the local storage.
 *
 * @param {String} id Id of the changed note.
 */
function storeNotebook() {
    let notes = document.querySelector("#notes");

    if (notes) {
        localStorage.setItem("notebook", notes.innerHTML);
    } 
}

//==   Custom elements.

/**
 * Custom element to hold the control buttons of a note.
 */
class NoteButtons extends HTMLElement {
    constructor() {
        super();
    }

    set id(id) {
        this.setAttribute("id", "buttons_" + id);
    }
}

/**
 * Custom element for the cancel button in the edit note mode.
 */
class CancelButton extends HTMLElement {
    constructor() {
        super();

    }
    set id(id) {
        this.setAttribute("note_id", id);
        this.setAttribute("id", "cancel_" + id);
    }

    connectedCallback() {
        this.innerText = "cancel";
        this.setAttribute("title", "cancel");
        this.setAttribute("class", "cancel-button");
        this.setAttribute("class", "button");
        this.addEventListener('click', () => {
            cancelEdit(this.getAttribute("note_id"));
        })
    }
}

/**
 * Custom element for the save button in the edit note mode.
 */
class SaveButton extends HTMLElement {
    constructor() {
        super();

    }
    set id(id) {
        this.setAttribute("note_id", id);
        this.setAttribute("id", "save_" + id);
    }

    connectedCallback() {
        this.innerText = "save";
        this.setAttribute("title", "save");
        this.setAttribute("class", "save-button");
        this.setAttribute("class", "button");
        this.addEventListener('click', () => {
            saveNote(this.getAttribute("note_id"));
        })
    }
}

/**
 * Custom element for the delete button in the view note mode.
 */
class DeleteButton extends HTMLElement {
    constructor() {
        super();

    }
    set id(id) {
        this.setAttribute("note_id", id);
        this.setAttribute("id", "delete_" + id);
    }

    connectedCallback() {
        this.innerText = "delete";
        this.setAttribute("title", "delete");
        this.setAttribute("class", "delete-button")
        this.setAttribute("class", "button")
        this.addEventListener('click', () => {
            deleteNote(this.getAttribute("note_id"));
        })
    }

}

/**
 * Custom element for the edit button in the view note mode.
 */
class EditButton extends HTMLElement {
    constructor() {
        super();

    }
    set id(id) {
        this.setAttribute("note_id", id);
        this.setAttribute("id", "edit_" + id);
    }

    connectedCallback() {
        this.innerText = "edit";
        this.setAttribute("title", "edit");
        this.setAttribute("class", "edit-button");
        this.setAttribute("class", "button");
        this.addEventListener('click', () => {
            editNote(this.getAttribute("note_id"));
        })
    }
}

/**
 * Custom element for the note wrapper. 
 */
class NoteWrapper extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute("class", "note")
    }

    set id(id) {
        this.setAttribute("id", "note_" + id + "_wrapper");
    }

    set backgroundColor(color) {
        this.style = "background-color:" + color + ";";
    }

    set noteContent(noteContent) {
        this.appendChild(noteContent);
    }

    set buttons(buttons) {
        this.appendChild(buttons);
    }
}

/**
 * Custom element for a note.
 * Contains logic for note modification.
 */
class Note extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * Set the note id.
     * Also set a my-id attribute so we can reference other elements in the note.
     */
    set id(id) {
        this.setAttribute("id", "note_" + id);
        this.setAttribute("my-id", id);
    }

    /**
     * Set the title of the note.
     */
    set title(title) {
        let myId = this.getAttribute("my-id");
        let titleWrapper = document.querySelector("#note_" + myId + "_title");

        if (titleWrapper !== null) {
            titleWrapper.innerText = title;
        } else {
            titleWrapper = document.createElement("h3");
            titleWrapper.setAttribute("id", "note_" + myId + "_title");
            titleWrapper.innerText = title !== null && title !== '' ? title : "untitled note";
            this.appendChild(titleWrapper);
        }
    }

    /**
     * Set the text of the note.
     */
    set text(text) {
        let myId = this.getAttribute("my-id");
        let textBlock = document.querySelector("#note_" + myId + "_text");

        if (textBlock !== null) {
            textBlock.innerText = text;
        } else {
            textBlock = document.createElement("p");
            textBlock.setAttribute("id", "note_" + myId + "_text");
            textBlock.innerText = text;
            this.appendChild(textBlock);
        }
    }

    setCreatedTimestamp() {
        this.insertBefore(this.createInitialTimestamp(), this.lastChild);
    }

    /**
     * Cancel an ongoing edit of a note.
     */
    cancelEdit() {
        let id = this.getAttribute("my-id");

        //Reset the note text.
        let noteText = document.querySelector("#note_" + id + "_text");
        let newNoteText = document.createElement("p");
        newNoteText.setAttribute("id", "note_" + id + "_text");
        newNoteText.innerText = this.savedText;
        noteText.parentNode.replaceChild(newNoteText, noteText);

        //Reset the note title.
        let title = document.querySelector("#note_" + id + "_title");
        let newTitle = document.createElement("h3");
        newTitle.innerText = this.savedTitle;
        newTitle.setAttribute("id", "note_" + id + "_title");
        title.parentNode.replaceChild(newTitle, title);

        //Readd the modification buttons to the note.
        let modifyButtons = createLiveNoteModificationButtons(id);

        let buttons = document.querySelector("#buttons_" + id);
        buttons.parentNode.replaceChild(modifyButtons, buttons);
    }

    /**
     * Initiate the edit of a note.
     */
    edit() {
        let id = this.getAttribute("my-id");

        //Change the text of the note to an input textarea.
        let noteText = document.querySelector("#note_" + id + "_text");
        this.savedText = noteText.innerText;
        let editableNote = document.createElement('textarea');
        editableNote.setAttribute("id", "note_" + id + "_text");
        editableNote.innerText = this.savedText;
        noteText.parentNode.replaceChild(editableNote, noteText);
        
        //Change the text of the title to an input.
        let title = document.querySelector("#note_" + id + "_title");
        this.savedTitle = title.innerText;
        let editableTitle = document.createElement("input");
        editableTitle.setAttribute("id", "note_" + id + "_title");
        editableTitle.value = this.savedTitle;
        title.parentNode.replaceChild(editableTitle, title);

        //Swap the buttons with edit buttons.
        let editButtons = createLiveNoteEditButtons(id);
        let buttons = document.querySelector("#buttons_" + id);
        buttons.parentNode.replaceChild(editButtons, buttons);
    }

    /**
     * Save a notes content that is being edited.
     */
    save() {
        let id = this.getAttribute("my-id");
        
        //Save the value in the text area of the note to the note.
        let noteText = document.querySelector("#note_" + id + "_text");
        let noteContent = noteText.value;
        let newNoteText = document.createElement("p");
        newNoteText.setAttribute("id", "note_" + id + "_text");
        newNoteText.innerText = noteContent;
        noteText.parentNode.replaceChild(newNoteText, noteText);

        //Save the value of the title to the note.
        let title = document.querySelector("#note_" + id + "_title");
        let titleText = title.value;
        let newTitle = document.createElement("h3");
        newTitle.innerText = titleText;
        newTitle.setAttribute("id", "note_" + id + "_title");
        title.parentNode.replaceChild(newTitle, title);

        //Update the last mofification time of the note.
        let lastModify = document.querySelector("#note_" + id + "_last_edit");
        if (lastModify == null) {
            let dates = document.querySelector("#note_" + id + "_create_modify")
            let editDate = document.createElement("span")
            editDate.setAttribute("id", "note_" + id + "_last_edit")
            editDate.innerText = "Last edited: " + new Date();
            dates.appendChild(editDate)
        } else {
            lastModify.innerText = "Last edited: " + new Date();
        }

        let modifyButtons = createLiveNoteModificationButtons(id);

        let buttons = document.querySelector("#buttons_" + id);
        buttons.parentNode.replaceChild(modifyButtons, buttons);
    }

    /**
     * Create tehe timestamp block for a note, containing the initial created time.
     */
    createInitialTimestamp() {
        let myId = this.getAttribute("my-id");
        let createModifyTimes = document.createElement("div");
        createModifyTimes.setAttribute("class", "create_modify_times");
        createModifyTimes.setAttribute("id", "note_" + myId + "_create_modify");
        let createTime = document.createElement("span");
        createTime.setAttribute("id", "note_" + myId + "created", createTime);
        createTime.innerText = "Created: " + new Date();
        createModifyTimes.appendChild(createTime);

        return createModifyTimes;
    }
}

//Add the custom elements.
customElements.define('edit-button', EditButton);
customElements.define('delete-button', DeleteButton);
customElements.define('save-button', SaveButton);
customElements.define('cancel-button', CancelButton);
customElements.define('note-buttons', NoteButtons);
customElements.define('note-wrapper', NoteWrapper);
customElements.define('notebook-note', Note);
