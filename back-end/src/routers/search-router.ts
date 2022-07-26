import { Router, Request, Response, NextFunction } from "express";
import { portfolioService, qnaService } from "../services";
import { validateRequestWith } from "../middlewares";
import { searchPortfolioJoi, searchQnaJoi } from "../db/schemas/joi-schemas";
const searchRouter = Router();

// 1. 포토폴리오 검색
searchRouter.get(
  "/portfolios",
  validateRequestWith(searchPortfolioJoi, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = (req.query.option as string[]) || [
        "title",
        "contentText",
        "author",
      ];
      const value = req.query.value as string;
      const orderBy = (req.query.orderBy as string) || "createdAt";
      const skills = req.query.skill as string[];
      const searchInfo = { options, value, orderBy, skills };

      const page = parseInt(req.query.page as string);
      const Portfolios = await portfolioService.getPortfoliosBySearch(
        searchInfo,
        page
      );
      res.status(200).json(Portfolios);
    } catch (error) {
      next(error);
    }
  }
);
// 2. QnA 검색
searchRouter.get(
  "/qnas",
  validateRequestWith(searchQnaJoi, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = req.query.value as string;
      const page = parseInt(req.query.page as string);
      const QnAs = await qnaService.getQnasBySearch(value, page);
      res.status(200).json(QnAs);
    } catch (error) {
      next(error);
    }
  }
);

export { searchRouter };
