import { Router, Request, Response, NextFunction } from "express";
import { qnaService, userService } from "../services";
import { ExtendReq, loginRequired } from "../middlewares/login-required";

const qnaRouter = Router();

qnaRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const QnAs = await qnaService.getQnas();
    res.status(200).json(QnAs);
  } catch (error) {
    next(error);
  }
});

qnaRouter.get(
  "/:qnaId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qnaId = req.params.qnaId;
      const Question = await qnaService.getQnaById(qnaId);
      const Answers = await qnaService.getAnswerByQuestion(qnaId);
      res.status(200).json({ Question, Answers });
    } catch (error) {
      next(error);
    }
  }
);

qnaRouter.get(
  "/user/:userId",
  async (req: ExtendReq, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const QnA = await qnaService.getQnaByUserId(userId);
      res.status(200).json(QnA);
    } catch (error) {
      next(error);
    }
  }
);

qnaRouter.post(
  "/",
  loginRequired,
  async (req: ExtendReq, res: Response, next: NextFunction) => {
    try {
      const authorId = req.currentUserId || "";
      const userInfo = await userService.getUserInfo(authorId);
      const author = userInfo.nickname;
      const { title, contents, contentText, isAnswer, parentQnaId } = req.body;
      const tags = JSON.parse(req.body.tags);
      const newQnA = await qnaService.addQna({
        title,
        contents,
        contentText,
        authorId,
        author,
        tags,
        isAnswer,
        parentQnaId,
      });
      res.status(201).json(newQnA);
    } catch (error) {
      next(error);
    }
  }
);

qnaRouter.put(
  "/:qnaId",
  loginRequired,
  async (req: ExtendReq, res: Response, next: NextFunction) => {
    try {
      const qnaId = req.params.qnaId;
      const userId = req.currentUserId || "";
      const {
        title,
        contents,
        contentText,
        recommends,
        isAnswer,
        parentQnaId,
      } = req.body;
      const tags = JSON.parse(req.body.tags);
      const toUpdate = {
        ...(title && { title }),
        ...(contents && { contents }),
        ...(contentText && { contentText }),
        ...(recommends && { recommends }),
        ...(tags && { tags }),
        ...(isAnswer && { isAnswer }),
        ...(parentQnaId && { parentQnaId }),
      };
      const updatedQnaA = await qnaService.setQna(qnaId, userId, toUpdate);
      res.status(200).json(updatedQnaA);
    } catch (error) {
      next(error);
    }
  }
);

qnaRouter.put(
  "/:qnaId/recommendation",
  loginRequired,
  async (req: ExtendReq, res: Response, next: NextFunction) => {
    try {
      const qnaId = req.params.qnaId;
      const userId = req.currentUserId || "";
      const recommended = req.query.recommended === "true";
      const updatedQnA = await qnaService.recommendQna(
        qnaId,
        userId,
        recommended
      );
      res.status(200).json(updatedQnA);
    } catch (error) {
      next(error);
    }
  }
);
qnaRouter.delete(
  "/:qnaId",
  loginRequired,
  async (req: ExtendReq, res: Response, next: NextFunction) => {
    try {
      const qnaId = req.params.qnaId;
      const userId = req.currentUserId || "";
      const deletedQna = await qnaService.deleteQna(qnaId, userId);
      res.status(200).json(deletedQna);
    } catch (error) {
      next(error);
    }
  }
);

export { qnaRouter };
