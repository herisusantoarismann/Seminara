const jwt = require("jsonwebtoken");
const massmailer = require("../../services/mass-mailer");
const cfgenv = require("../../config/env");
const participantsCollection = require("../models").collectionParticipants;
const seminarsCollection = require("../models").collection;
const generateId = require("../models").generateid;

module.exports = () => {
  return {
    AuthV1: async (req, res) => {
      const [CRED_USERNAME, CRED_PASSWORD] = cfgenv.server.authCred.split(":");

      // validate cred
      if (
        req.body.username !== CRED_USERNAME ||
        req.body.password !== CRED_PASSWORD
      ) {
        return res.status(400).json({
          success: false,
          message: "token generate failure: invalid auth",
        });
      }
      // generate token
      const payload = {
        username: CRED_USERNAME,
      };
      const token = "Bearer " + jwt.sign(payload, cfgenv.server.authSecret);

      res.json({
        success: true,
        message: "token generated succesfully",
        token: token,
      });
    },

    SendMassMailV1: async (req, res) => {
      let params = {
        subject: req.body.subject,
        recipients: req.body.recipients,
        type: req.body.type,
        content: req.body.content,
      };

      await massmailer.sendMassMail(params);
      res.json({
        message: "Email Berhasil Dikirim",
      });
    },

    RegisterSeminarV1: async (req, res) => {
      const newSeminar = new seminarsCollection({
        itemid: generateId(), // ini randomized identifier yang macem AXALH32IOOYBCK234
        title: req.body.title,
        partner: req.body.partner,
        speaker: req.body.speaker,
        moderator: req.body.moderator,
        date: req.body.date,
        starthour: req.body.starthour,
        durationMinutes: req.body.durationMinutes,
      });

      await newSeminar.save();
      res.json({
        status: "Success",
        message: "Seminar Baru Berhasil Dibuat",
        data: {
          itemid: newSeminar.itemid,
          title: newSeminar.title,
          partner: newSeminar.partner,
          speaker: newSeminar.speaker,
          moderator: newSeminar.moderator,
          date: newSeminar.date,
          starthour: newSeminar.starthour,
          durationMinutes: newSeminar.durationMinutes,
        },
      });
    },

    ShowAllSeminarsV1: async (req, res) => {
      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const data = await seminarsCollection.paginate({}, paginateOption);
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "ascending" },
      };
      const AscTitleData = await seminarsCollection.paginate(
        {},
        AscTitleOption
      );
      const AscDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "ascending" },
      };
      const AscDateData = await seminarsCollection.paginate({}, AscDateOption);
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "descending" },
      };
      const DescTitleData = await seminarsCollection.paginate(
        {},
        DescTitleOption
      );
      const DescDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "descending" },
      };
      const DescDateData = await seminarsCollection.paginate(
        {},
        DescDateOption
      );

      res.json({
        status: "Success",
        message: "Berhasil Menampilkan Data",
        data: {
          result: data,
        },
        AscDateData: {
          result: AscDateData,
        },
        AscTitleData: {
          result: AscTitleData,
        },
        DescDateData: {
          result: DescDateData,
        },
        DescTitleData: {
          result: DescTitleData,
        },
      });
    },

    DoneSeminarV1: async (req, res) => {
      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const data = await seminarsCollection.paginate(
        { date: { $lte: new Date() } },
        paginateOption
      );
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "ascending" },
      };
      const AscTitleData = await seminarsCollection.paginate(
        { date: { $lte: new Date() } },
        AscTitleOption
      );
      const AscDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "ascending" },
      };
      const AscDateData = await seminarsCollection.paginate(
        { date: { $lte: new Date() } },
        AscDateOption
      );
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "descending" },
      };
      const DescTitleData = await seminarsCollection.paginate(
        { date: { $lte: new Date() } },
        DescTitleOption
      );
      const DescDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "descending" },
      };
      const DescDateData = await seminarsCollection.paginate(
        { date: { $lte: new Date() } },
        DescDateOption
      );

      res.json({
        status: "Success",
        message: "Berhasil Menampilkan Data",
        data: {
          result: data,
        },
        AscDateData: {
          result: AscDateData,
        },
        AscTitleData: {
          result: AscTitleData,
        },
        DescDateData: {
          result: DescDateData,
        },
        DescTitleData: {
          result: DescTitleData,
        },
      });
    },

    CountDoneSeminarV1: async (req, res) => {
      const result = await seminarsCollection.countDocuments({
        date: { $lte: new Date() },
      });

      res.json({
        status: "success",
        message: "Partisipan berhasil dihitung",
        data: result,
      });
    },

    TodaySeminarV1: async (req, res) => {
      var start = new Date();
      start.setHours(0, 0, 0, 0);

      var end = new Date();
      end.setHours(23, 59, 59, 999);

      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const data = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        paginateOption
      );
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "ascending" },
      };
      const AscTitleData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        AscTitleOption
      );
      const AscDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "ascending" },
      };
      const AscDateData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        AscDateOption
      );
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "descending" },
      };
      const DescTitleData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        DescTitleOption
      );
      const DescDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "descending" },
      };
      const DescDateData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        DescDateOption
      );

      res.json({
        status: "Success",
        message: "Berhasil Menampilkan Data",
        data: {
          result: data,
        },
        AscDateData: {
          result: AscDateData,
        },
        AscTitleData: {
          result: AscTitleData,
        },
        DescDateData: {
          result: DescDateData,
        },
        DescTitleData: {
          result: DescTitleData,
        },
      });
    },

    CountTodaySeminarV1: async (req, res) => {
      var start = new Date();
      start.setHours(0, 0, 0, 0);

      var end = new Date();
      end.setHours(23, 59, 59, 999);

      const result = await seminarsCollection.countDocuments({
        date: { $gte: start, $lt: end },
      });

      res.json({
        status: "success",
        message: "Partisipan berhasil dihitung",
        data: result,
      });
    },

    ThisMonthV1: async (req, res) => {
      var month = new Date().getMonth();
      var year = new Date().getFullYear();
      var d = new Date(year, month + 1, 0);

      var start = new Date();
      start.setDate(1);

      var end = new Date();
      end.setDate(d.getDate());

      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const data = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        paginateOption
      );
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "ascending" },
      };
      const AscTitleData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        AscTitleOption
      );
      const AscDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "ascending" },
      };
      const AscDateData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        AscDateOption
      );
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "descending" },
      };
      const DescTitleData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        DescTitleOption
      );
      const DescDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "descending" },
      };
      const DescDateData = await seminarsCollection.paginate(
        { date: { $gte: start, $lt: end } },
        DescDateOption
      );

      res.json({
        status: "Success",
        message: "Berhasil Menampilkan Data",
        data: {
          result: data,
        },
        AscDateData: {
          result: AscDateData,
        },
        AscTitleData: {
          result: AscTitleData,
        },
        DescDateData: {
          result: DescDateData,
        },
        DescTitleData: {
          result: DescTitleData,
        },
      });
    },

    CountThisMonthSeminarV1: async (req, res) => {
      var month = new Date().getMonth();
      var year = new Date().getFullYear();
      var d = new Date(year, month + 1, 0);

      var start = new Date();
      start.setDate(1);

      var end = new Date();
      end.setDate(d.getDate());

      const result = await seminarsCollection.countDocuments({
        date: { $gte: start, $lt: end },
      });

      res.json({
        status: "success",
        message: "Partisipan berhasil dihitung",
        data: result,
      });
    },

    UpcomingSeminarV1: async (req, res) => {
      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const data = await seminarsCollection.paginate(
        { date: { $gte: new Date() } },
        paginateOption
      );
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "ascending" },
      };
      const AscTitleData = await seminarsCollection.paginate(
        { date: { $gte: new Date() } },
        AscTitleOption
      );
      const AscDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "ascending" },
      };
      const AscDateData = await seminarsCollection.paginate(
        { date: { $gte: new Date() } },
        AscDateOption
      );
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "descending" },
      };
      const DescTitleData = await seminarsCollection.paginate(
        { date: { $gte: new Date() } },
        DescTitleOption
      );
      const DescDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "descending" },
      };
      const DescDateData = await seminarsCollection.paginate(
        { date: { $gte: new Date() } },
        DescDateOption
      );

      res.json({
        status: "Success",
        message: "Berhasil Menampilkan Data",
        data: {
          result: data,
        },
        AscDateData: {
          result: AscDateData,
        },
        AscTitleData: {
          result: AscTitleData,
        },
        DescDateData: {
          result: DescDateData,
        },
        DescTitleData: {
          result: DescTitleData,
        },
      });
    },

    CountUpcomingSeminarV1: async (req, res) => {
      const result = await seminarsCollection.countDocuments({
        date: { $gte: new Date() },
      });

      res.json({
        status: "success",
        message: "Partisipan berhasil dihitung",
        data: result,
      });
    },

    ShowSeminarV1: async (req, res) => {
      const data = await seminarsCollection.findById(req.params.id);
      res.json({
        status: "Success",
        message: `Berhasil Menampilkan Seminar Dengan ID : ${req.params.id}`,
        data: data,
      });
    },

    FilterSeminarV1: async (req, res) => {
      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "ascending" },
      };
      const AscDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "ascending" },
      };
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { title: "descending" },
      };
      const DescDateOption = {
        page: req.params.page,
        limit: 5,
        sort: { date: "descending" },
      };
      const keyword = req.body.keyword;
      if (keyword) {
        var data = await seminarsCollection.paginate(
          {
            title: { $regex: keyword, $options: "$i" },
          },
          paginateOption
        );
        var AscTitleData = await seminarsCollection.paginate(
          { title: { $regex: keyword, $options: "$i" } },
          AscTitleOption
        );
        var AscDateData = await seminarsCollection.paginate(
          { title: { $regex: keyword, $options: "$i" } },
          AscDateOption
        );
        var DescTitleData = await seminarsCollection.paginate(
          { title: { $regex: keyword, $options: "$i" } },
          DescTitleOption
        );
        var DescDateData = await seminarsCollection.paginate(
          { title: { $regex: keyword, $options: "$i" } },
          DescDateOption
        );
      } else {
        var data = await seminarsCollection.paginate({}, paginateOption);
        var AscTitleData = await seminarsCollection.paginate(
          {},
          AscTitleOption
        );
        var AscDateData = await seminarsCollection.paginate({}, AscDateOption);
        var DescTitleData = await seminarsCollection.paginate(
          {},
          DescTitleOption
        );
        var DescDateData = await seminarsCollection.paginate(
          {},
          DescDateOption
        );
      }

      res.json({
        status: "Success",
        message: `Berhasil Menampilkan Seminar dengan keyword : ${req.params.keyword}`,
        data: {
          result: data,
        },
        AscDateData: {
          result: AscDateData,
        },
        AscTitleData: {
          result: AscTitleData,
        },
        DescDateData: {
          result: DescDateData,
        },
        DescTitleData: {
          result: DescTitleData,
        },
      });
    },

    UpdateSeminarV1: async (req, res) => {
      let payload = {
        title: req.body.title,
        partner: req.body.partner,
        speaker: req.body.speaker,
        moderator: req.body.moderator,
        date: req.body.date,
        starthour: req.body.starthour,
        durationMinutes: req.body.durationMinutes,
      };

      await seminarsCollection.findOneAndUpdate(
        { _id: req.params.id },
        payload
      );
      res.json({
        status: "Success",
        message: `Berhasil Mengubah Seminar dengan ID : ${req.params.id}`,
      });
    },

    DeleteSeminarV1: async (req, res) => {
      await seminarsCollection.findOneAndDelete({
        itemid: req.params.id,
      });
      await participantsCollection.deleteMany({
        seminaritemid: req.params.id,
      });
      res.json({
        status: "Success",
        message: `Berhasil Menghapus Seminar dengan ID : ${req.params.id}`,
      });
    },
    CreateParticipantsV1: async (req, res) => {
      const newParticipants = new participantsCollection({
        seminaritemid: req.params.idseminar,
        itemid: generateId(),
        name: req.body.name,
        email: req.body.email,
        agency: req.body.agency,
        phone: req.body.phone,
        option: req.body.option,
        proof: req.body.nameProof + req.file.originalname,
        verified: false,
      });
      const data = await newParticipants.save();
      res.json({
        status: "success",
        message: "Berhasil Membuat Partisipan Baru",
        data: data,
      });
    },

    ShowAllParticipantsV1: async (req, res) => {
      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const result = await participantsCollection.paginate(
        {
          seminaritemid: req.params.idseminar,
        },
        paginateOption
      );
      const AscOption = {
        page: req.params.page,
        limit: 5,
        sort: { name: "ascending" },
      };
      const AscData = await participantsCollection.paginate(
        {
          seminaritemid: req.params.idseminar,
        },
        AscOption
      );
      const DescOption = {
        page: req.params.page,
        limit: 5,
        sort: { name: "descending" },
      };
      const DescData = await participantsCollection.paginate(
        {
          seminaritemid: req.params.idseminar,
        },
        DescOption
      );

      res.json({
        status: "success",
        message: "Semua partisipan berhasil ditampilkan",
        data: {
          result: result,
        },
        AscData: {
          result: AscData,
        },
        DescData: {
          result: DescData,
        },
      });
    },

    CountParticipantsV1: async (req, res) => {
      const result = await participantsCollection.countDocuments({});

      res.json({
        status: "success",
        message: "Partisipan berhasil dihitung",
        data: result,
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

    ShowParticipantFreeV1: async (req, res) => {
      const result = await participantsCollection.find(
        {
          seminaritemid: req.params.idseminar,
          option: "Free",
        },
        { email: 1 }
      );

      res.json({
        status: "success",
        message: "partisipan berhasil ditampilkan",
        data: result,
      });
    },

    ShowParticipantPayV1: async (req, res) => {
      const result = await participantsCollection.find(
        {
          seminaritemid: req.params.idseminar,
          option: "Pay",
        },
        { email: 1 }
      );

      res.json({
        status: "success",
        message: "partisipan berhasil ditampilkan",
        data: result,
      });
    },

    VerifiedParticipantV1: async (req, res) => {
      const verified = {
        verified: req.body.verified,
      };
      await participantsCollection.findOneAndUpdate(
        {
          seminaritemid: req.params.idseminar,
          itemid: req.params.id,
        },
        verified
      );
      res.json({
        status: "success",
      });
    },

    UpdateParticipantV1: async (req, res) => {
      const participantUpdate = {
        name: req.body.name,
        email: req.body.email,
        agency: req.body.agency,
        phone: req.body.phone,
      };
      await participantsCollection.findOneAndUpdate(
        {
          seminaritemid: req.params.idseminar,
          itemid: req.params.id,
        },
        participantUpdate
      );
      res.json({
        status: "success",
        message: "partisipan berhasil diubah",
      });
    },

    DeleteParticipantV1: async (req, res) => {
      await participantsCollection.findOneAndDelete({
        seminaritemid: req.params.idseminar,
        itemid: req.params.id,
      });
      res.json({
        status: "success",
        message: "partisipan berhasil dihapus",
      });
    },

    FilterParticipantsV1: async (req, res) => {
      const paginateOption = {
        page: req.params.page,
        limit: 5,
      };
      const AscTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { name: "ascending" },
      };
      const DescTitleOption = {
        page: req.params.page,
        limit: 5,
        sort: { name: "descending" },
      };
      const keyword = req.body.keyword;
      if (keyword) {
        var data = await participantsCollection.paginate(
          {
            seminaritemid: req.params.idseminar,
            name: { $regex: keyword, $options: "$i" },
          },
          paginateOption
        );
        var AscTitleData = await participantsCollection.paginate(
          {
            seminaritemid: req.params.idseminar,
            name: { $regex: keyword, $options: "$i" },
          },
          AscTitleOption
        );
        var DescTitleData = await participantsCollection.paginate(
          {
            seminaritemid: req.params.idseminar,
            name: { $regex: keyword, $options: "$i" },
          },
          DescTitleOption
        );
      } else {
        var data = await participantsCollection.paginate({}, paginateOption);
        var AscTitleData = await participantsCollection.paginate(
          {},
          AscTitleOption
        );
        var DescTitleData = await participantsCollection.paginate(
          {},
          DescTitleOption
        );
      }

      res.json({
        status: "Success",
        message: `Berhasil Menampilkan Participants dengan keyword : ${req.params.keyword}`,
        data: {
          result: data,
        },

        AscTitleData: {
          result: AscTitleData,
        },

        DescTitleData: {
          result: DescTitleData,
        },
        param: req.params.idseminar,
      });
    },
  };
};
