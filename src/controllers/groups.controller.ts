import { NextFunction, Request, Response } from 'express';
import { CreateGroupDto } from '@dtos/groups.dto';
import { Group } from '@interfaces/groups.interface';
import groupService from '@services/groups.service';

class GroupsController {
  public groupService = new groupService();

  public getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGroupsData: Group[] = await this.groupService.findAllGroup();

      res.status(200).json({ data: findAllGroupsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getGroupById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId: string = req.params.id;
      const findOneGroupData: Group = await this.groupService.findGroupById(groupId);

      res.status(200).json({ data: findOneGroupData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupData: CreateGroupDto = req.body;
      const createGroupData: Group = await this.groupService.createGroup(groupData);

      res.status(201).json({ data: createGroupData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId: string = req.params.id;
      const groupData: CreateGroupDto = req.body;
      const updateGroupData: Group = await this.groupService.updateGroup(groupId, groupData);

      res.status(200).json({ data: updateGroupData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId: string = req.params.id;
      const deleteGroupData: Group = await this.groupService.deleteGroup(groupId);

      res.status(200).json({ data: deleteGroupData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  //TODO: user input validation can be improved
  public addUsersToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId: string = req.params.id;
      const userIds: string[] = req.body.userIds;
      const GroupData: Group = await this.groupService.addUsersToGroup(groupId, userIds);

      res.status(200).json({ data: GroupData, message: 'users added to group' });
    } catch (error) {
      next(error);
    }
  };

  //TODO: user input validation can be improved
  public removeUsersToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId: string = req.params.id;
      const userIds: string[] = req.body.userIds;
      const GroupData: Group = await this.groupService.removeUsersFromGroup(groupId, userIds);

      res.status(200).json({ data: GroupData, message: 'users removed from group' });
    } catch (error) {
      next(error);
    }
  };
}

export default GroupsController;
