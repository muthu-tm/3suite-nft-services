import Joi from 'joi';

import * as Exceptions from '../exceptions/Exceptions.js';
export default class Controller {
  constructor(response) {
    this.response = response;
  }

    /**
     * validate params
     * @param {} request
     * @param {} validationSchema
     */
    validateParams(request, validationSchema, queryParams = false) {
  
      if (validationSchema) {
        const data = queryParams?request.query:request.body;
        const {
          error,
          value,
        } = validationSchema.validate(data);
        if (error) {
          console.log(error)
          throw (new Exceptions.ValidationException(error.details[0].message));
        }
        return value;
      }
  
      return null;
    }

  /**
   * common method for sending success response
   * @param {*} data
   */
  sendResponse(data) {
    this.response.status(200).json(data);
  }

  /**
   * method for handling exceptions
   * @param {*} error
   */
  handleException(error) {
    // console.log(error);
    // masking db exceptions
    if (error.sql) {
      error.name = "DbException";
    }

    switch (error.name) {
      case "GeneralException":
        this.response.status(500).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        console.error(new Error(error));
        break;
      case "UnauthorizedException":
        console.error("UnauthorizedException: %s", error.message);
        this.response.status(401).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        break;
      case "NotFoundException":
        console.error("NotFoundException: %s", error.message);
        this.response.status(404).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        break;
      case "ConflictException":
        console.error("ConflictException: %s", error.message);
        this.response.status(409).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        break;
      case "ValidationException":
        console.error("ValidationException: %s", error.message);
        this.response.status(422).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        break;
      case "ForbiddenException":
        console.error("ForbiddenException: %s", error.message);

        this.response.status(403).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        break;
      case "ClientException":
        console.error(error.message);
        this.response.status(400).json({
          status: false,
          error: {
            status: error.message,
          },
        });
        break;
      default:
        console.log(error)
        console.error(new Error(error));
        this.response.status(501).json({
          status: false,
          error: {
            status: "Unable to process request, please try later!",
          },
        });
        break;
    }
  }
}
