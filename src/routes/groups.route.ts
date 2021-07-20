import { Router } from 'express';
import GroupsController from '@controllers/groups.controller';
import { CreateGroupDto, AddUsersToGroupDto } from '@dtos/groups.dto';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class GroupsRoute implements Route {
  public path = '/groups';
  public router = Router();
  public groupsController = new GroupsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.groupsController.getGroups);
    this.router.get(`${this.path}/:id`, this.groupsController.getGroupById);
    this.router.post(`${this.path}`, validationMiddleware(CreateGroupDto, 'body'), this.groupsController.createGroup);
    this.router.put(`${this.path}/:id/add-users`, validationMiddleware(AddUsersToGroupDto, 'body', true), this.groupsController.addUsersToGroup);
    this.router.put(`${this.path}/:id/remove-users`, validationMiddleware(AddUsersToGroupDto, 'body', true), this.groupsController.addUsersToGroup);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateGroupDto, 'body', true), this.groupsController.updateGroup);
    this.router.delete(`${this.path}/:id`, this.groupsController.deleteGroup);
  }
}

export default GroupsRoute;
