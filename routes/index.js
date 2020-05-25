import userRouter from './users'

const routers = [
  userRouter
]

export function registerRouters(app) {
  routers.forEach(router => app.use(router))
}