const participantsCollection = require("../models").collectionParticipants;
const seminarsCollection = require("../models").collection;
const generateId = require("../models").generateid;

module.exports = () => {
  return {
    RegisterSeminarParticipantsV1: async (req, res) => {
      const newParticipants = new participantsCollection({
        seminaritemid: req.params.idseminar,
        itemid: generateId(),
        name: req.body.name,
        email: req.body.email,
        agency: req.body.agency,
        phone: req.body.phone,
        option: req.body.option,
        proof: req.body.nameProof + req.file.originalname,
      });
      const data = await newParticipants.save();
      res.json({
        status: "success",
        message: "Berhasil Membuat Partisipan Baru",
        data: data,
      });
    },

    ShowParticipantV1: async (req, res) => {
      const result = await participantsCollection.find({
        seminaritemid: req.params.idseminar,
        itemid: req.params.id,
      });

      res.json({
        status: "success",
        message: "partisipan berhasil ditampilkan",
        data: result,
      });
    },

    ShowSeminarV1: async (req, res) => {
      const data = await seminarsCollection.find({ itemid: req.params.id });
      res.json({
        status: "Success",
        message: `Berhasil Menampilkan Seminar Dengan ID : ${req.params.id}`,
        data: data,
      });
    },
  };
};
