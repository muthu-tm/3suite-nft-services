/**
 * exposes all custom exceptions
 */
import GeneralException from './GeneralException.js';
import ClientException from './ClientException.js';
import NotFoundException from './NotFoundException.js';
import ConflictException from './ConflictException.js';
import ForbiddenException from './ForbiddenException.js';
import ValidationException from './ValidationException.js';
import UnauthorizedException from './UnauthorizedException.js';

export {
  GeneralException,
  ClientException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  ValidationException,
  UnauthorizedException,
};
