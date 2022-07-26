import { model, Types, Document } from "mongoose";
import { QnaSchema, QnaType } from "../schemas/qna-schema";
import { QnaInputDTO } from "../../interfaces/qna-interface";
import { qnaSearchCondition } from "../../utils/search-condition";

const Qna = model<QnaType & Document>("qnas", QnaSchema);

export class QnaModel {
  async findQuestions(page: number) {
    return await Qna.find({ isAnswer: false })
      .sort({ _id: -1 })
      .skip((page - 1) * 8)
      .limit(8);
  }

  async findById(qnaId: string) {
    return await Qna.findOne({ _id: qnaId }).populate([
      {
        path: "recommends",
        select: ["nickname", "imgUrl"],
      },
      {
        path: "comments",
        populate: {
          path: "author",
          select: ["nickname", "imgUrl"],
        },
      },
    ]);
  }

  async findAnswerById(qnaId: string) {
    return await Qna.find({ parentQnaId: qnaId }).populate([
      {
        path: "recommends",
        select: ["nickname", "imgUrl"],
      },
      {
        path: "comments",
        populate: {
          path: "author",
          select: ["nickname", "imgUrl"],
        },
      },
    ]);
  }

  async findByUserId(userId: string) {
    return await Qna.find({ authorId: userId });
  }

  async findBySearch(value: string, page: number) {
    const searchCondition = qnaSearchCondition(value, page);
    return await Qna.aggregate(searchCondition);
  }

  async getQuestionCountByUserId(userId: string) {
    return await Qna.find({ authorId: userId, isAnswer: false }).count();
  }

  async getAnswerCountByUserId(userId: string) {
    return await Qna.find({ authorId: userId, isAnswer: true }).count();
  }

  async create(qnaInfo: QnaInputDTO) {
    return await Qna.create(qnaInfo);
  }

  async update(qnaId: string, update: QnaInputDTO) {
    const filter = { _id: qnaId };
    const option = { returnOriginal: false };

    return await Qna.findOneAndUpdate(filter, update, option);
  }

  async updateComment(qnaId: string, commentId: Types.ObjectId) {
    const filter = { _id: qnaId };
    const option = { returnOriginal: false };
    return await Qna.findOneAndUpdate(
      filter,
      { $addToSet: { comments: commentId } },
      option
    );
  }

  async addRecommend(qnaId: string, userId: string) {
    const filter = { _id: qnaId };
    const option = { returnOriginal: false };
    return await Qna.findOneAndUpdate(
      filter,
      { $addToSet: { recommends: userId } },
      option
    );
  }

  async deleteRecommend(qnaId: string, userId: string) {
    const filter = { _id: qnaId };
    const option = { returnOriginal: false };
    return await Qna.findOneAndUpdate(
      filter,
      { $pull: { recommends: userId } },
      option
    );
  }

  async updateQnaComment(
    portId: string,
    commentId: Types.ObjectId,
    setType: string
  ) {
    const filter = { _id: portId };
    const option = { returnOriginal: false };
    return await Qna.findOneAndUpdate(
      filter,
      { [setType]: { comments: commentId } },
      option
    );
  }
  async deleteById(qnaId: string) {
    return await Qna.findOneAndDelete({ _id: qnaId });
  }
}

const qnaModel = new QnaModel();

export { qnaModel };
