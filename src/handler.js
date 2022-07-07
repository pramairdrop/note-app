const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { tittle, tag, body } = request.payload;

  const id = nanoid(16);

  const createAt = new Date().toISOString();
  const updateAt = createAt;

  const newNote = {
    tittle, tag, body, id, createAt, updateAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan Gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNoteHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak Ditemukan.',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { tittle, tag, body } = request.payload;
  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      tittle,
      tag,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diubah.',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal mengubah catatan, Id tidak ditemukan.',
  });
  response.code(400);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan Berhasil diHapus.',
    });
    response.code(200);
    return response;
  }

  const response = h.request({
    status: 'fail',
    message: 'Catatan Gagal diHapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler, getAllNoteHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler,
};
