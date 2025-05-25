import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { Train } from "../entities/Train";
import {
  CreateTrainDto,
  PartialTrainDto,
  UpdateTrainDto,
} from "../dto/train.dto";
import TEXT from "../utils/messages";
import { formatDuration } from "../utils/formatDuration";
import { calculateDurationInSeconds } from "../utils/calculateDurationInSeconds";

const trainRepository = AppDataSource.getRepository(Train);

export const createTrain = async (
  req: Request,
  res: Response
): Promise<void> => {
  const dto = plainToInstance(CreateTrainDto, req.body);
  const errors = await validate(dto);

  if (errors.length) {
    res.status(400).json({
      error: errors.map((e) => Object.values(e.constraints || {})).join(", "),
    });
    return;
  }

  try {
    const existing = await trainRepository.findOne({
      where: { trainNumber: dto.trainNumber },
    });
    if (existing) {
      res.status(409).json({ error: TEXT.ERROR.TRAIN_EXIST });
      return;
    }

    const duration = calculateDurationInSeconds(
      dto.departure.date,
      dto.departure.time,
      dto.arrival.date,
      dto.arrival.time
    );

    const train = trainRepository.create({ ...dto, duration });
    await trainRepository.save(train);

    res
      .status(201)
      .json({ ...train, durationFormatted: formatDuration(duration) });
  } catch (e) {
    console.error("Create train error:", e);
    res.status(500).json({ error: TEXT.ERROR.TRAIN_CREATE_FAIL });
  }
};

export const getAllTrains = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allowedFields = ["price", "duration"];
    const sortField = allowedFields.includes(req.query.sortBy as string)
      ? req.query.sortBy
      : "createdAt";
    const sortOrder = req.query.order === "asc" ? "ASC" : "DESC";

    const trains = await trainRepository.find({
      order: { [sortField as string]: sortOrder },
    });

    const result = trains.map((train) => ({
      ...train,
      durationFormatted: formatDuration(train.duration),
    }));

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: TEXT.ERROR.TRAIN_GET_FAIL });
  }
};

export const getTrainById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const train = await trainRepository.findOne({
      where: { id: req.params.id },
    });
    if (!train) {
      res.status(404).json({ error: TEXT.ERROR.TRAIN_NOT_FOUND });
      return;
    }

    res.json({
      ...train,
      durationFormatted: formatDuration(train.duration),
    });
  } catch (e) {
    res.status(500).json({ error: TEXT.ERROR.TRAIN_GET_FAIL });
  }
};

export const updateTrain = async (
  req: Request,
  res: Response
): Promise<void> => {
  const dto = plainToInstance(UpdateTrainDto, req.body);
  const errors = await validate(dto);

  if (errors.length) {
    res.status(400).json({
      error: errors.map((e) => Object.values(e.constraints || {})).join(", "),
    });
    return;
  }

  try {
    const train = await trainRepository.findOne({
      where: { id: req.params.id },
    });
    if (!train) {
      res.status(404).json({ error: TEXT.ERROR.TRAIN_NOT_FOUND });
      return;
    }
    const duration = calculateDurationInSeconds(
      dto.departure.date,
      dto.departure.time,
      dto.arrival.date,
      dto.arrival.time
    );

    trainRepository.merge(train, { ...dto, duration });
    const updated = await trainRepository.save(train);

    res.json({
      ...updated,
      durationFormatted: formatDuration(updated.duration),
    });
  } catch (e) {
    res.status(500).json({ error: TEXT.ERROR.TRAIN_UPDATE_FAIL });
  }
};

export const updateTrainPartially = async (
  req: Request,
  res: Response
): Promise<void> => {
  const dto = plainToInstance(PartialTrainDto, req.body);
  const errors = await validate(dto, { skipMissingProperties: true });

  if (errors.length > 0) {
    res.status(400).json({
      error: errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; "),
    });
    return;
  }

  try {
    const train = await trainRepository.findOne({
      where: { id: req.params.id },
    });
    if (!train) {
      {
        res.status(404).json({ error: TEXT.ERROR.TRAIN_NOT_FOUND });
        return;
      }
    }

    const mergedDeparture = { ...train.departure, ...dto.departure };
    const mergedArrival = { ...train.arrival, ...dto.arrival };

    if (dto.departure) train.departure = mergedDeparture;
    if (dto.arrival) train.arrival = mergedArrival;

    const isTimingChanged =
      dto.departure?.time ||
      dto.departure?.date ||
      dto.arrival?.time ||
      dto.arrival?.date;

    if (isTimingChanged) {
      train.duration = calculateDurationInSeconds(
        mergedDeparture.date,
        mergedDeparture.time,
        mergedArrival.date,
        mergedArrival.time
      );
    }

    const { departure, arrival, ...otherFields } = dto;
    Object.assign(train, otherFields);

    const updated = await trainRepository.save(train);

    res.json({
      ...updated,
      durationFormatted: formatDuration(updated.duration),
    });
  } catch (e) {
    console.error("Patch train error:", e);
    res.status(500).json({ error: TEXT.ERROR.TRAIN_UPDATE_FAIL });
  }
};

export const deleteTrain = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const train = await trainRepository.findOne({
      where: { id: req.params.id },
    });
    if (!train) {
      res.status(404).json({ error: TEXT.ERROR.TRAIN_NOT_FOUND });
      return;
    }

    await trainRepository.remove(train);
    res.json({ message: TEXT.SUCCESS.TRAIN_DELETED });
  } catch (e) {
    res.status(500).json({ error: TEXT.ERROR.TRAIN_DELETE_FAIL });
  }
};
