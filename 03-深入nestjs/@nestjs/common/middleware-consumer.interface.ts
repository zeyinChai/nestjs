export interface MiddlewareConsumer {
  apply(...middleware): this;
  forRoutes(...routes);
}
