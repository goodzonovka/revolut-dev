import gulp from 'gulp';

import { filePaths } from '../config/paths.js';
import { logger } from "../config/Logger.js";

const copy = () => {
  return gulp.src(filePaths.src.data)
    .pipe(logger.handleError('COPY'))
    .pipe(gulp.dest(filePaths.build.data));
};

export { copy };