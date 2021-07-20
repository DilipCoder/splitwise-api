import { CreateGroupDto } from '@dtos/groups.dto';
import HttpException from '@exceptions/HttpException';
import { Group } from '@interfaces/groups.interface';
import GroupModel from '@models/groups.model';
import { isEmpty } from '@utils/util';
import userService from './users.service';

class GroupService {
  public groups = GroupModel;
  public userService = new userService();

  public async findAllGroup(): Promise<Group[]> {
    const groups: Group[] = await this.groups.find();
    return groups;
  }

  public async findGroupById(groupId: string): Promise<Group> {
    if (isEmpty(groupId)) throw new HttpException(400, 'Internal Server ErrorId');

    const findGroup: Group = await this.groups.findOne({ _id: groupId });
    if (!findGroup) throw new HttpException(409, 'Internal Server Error');

    return findGroup;
  }

  public async createGroup(groupData: CreateGroupDto): Promise<Group> {
    console.log('gData', groupData);
    if (isEmpty(groupData)) throw new HttpException(400, 'Internal Server ErrorData');
    if (groupData.userIds.length == 0) throw new HttpException(400, 'Internal Server ErrorData');
    const group = { name: groupData.name, members: groupData.userIds };
    const createGroupData: Group = await this.groups.create(group);
    await this.userService._addGroupsToUser(groupData.userIds[0], [createGroupData._id]);
    return createGroupData;
  }

  // should be scraped, may cause serious issues,
  // TODO: strict field validations to make consistent update
  public async updateGroup(groupId: string, groupData: CreateGroupDto): Promise<Group> {
    if (isEmpty(groupData)) throw new HttpException(400, 'Internal Server ErrorData');

    const updateGroupById: Group = await this.groups.findByIdAndUpdate(groupId, { ...groupData }, { multi: true, new: true });
    if (!updateGroupById) throw new HttpException(409, 'Internal Server Error');

    return updateGroupById;
  }

  // TODO: remove user group references from user service
  public async deleteGroup(groupId: string): Promise<Group> {
    const deleteGroupById: Group = await this.groups.findByIdAndDelete(groupId);
    if (!deleteGroupById) throw new HttpException(409, 'Internal Server Error');
    return deleteGroupById;
  }

  public async addUsersToGroup(groupId: string, userIds: string[]): Promise<Group> {
    if (!userIds.length) throw new HttpException(400, 'no userIds to add');
    //TODO: check for valid userIds
    const group: Group = await this.groups.findById(groupId);
    if (!group) throw new HttpException(400, 'invalid group id');

    const userIdsForUpdate = userIds.filter(x => !group.members.includes(x));

    const updateGroupById: Group = await this.groups.findByIdAndUpdate(
      groupId,
      { $push: { members: { $each: userIdsForUpdate } } },
      { multi: true, new: true },
    );
    if (!updateGroupById) throw new HttpException(409, 'Internal Server Error');
    const updateUser = userIds.map(x => this.userService._addGroupsToUser(x, [updateGroupById._id]));
    await Promise.all(updateUser);
    return updateGroupById;
  }

  public async removeUsersFromGroup(groupId: string, userIds: string[]): Promise<Group> {
    if (!userIds.length) throw new HttpException(400, 'no userIds to remove');
    //TODO: check for valid userIds

    const updateGroupById: Group = await this.groups.findByIdAndUpdate(groupId, { $pull: { members: { $in: userIds } } }, { multi: true, new: true });
    if (!updateGroupById) throw new HttpException(409, 'Internal Server Error');
    const updateUser = userIds.map(x => this.userService._removeGroupsToUser(x, [updateGroupById._id]));
    await Promise.all(updateUser);
    return updateGroupById;
  }

  public async _addExpensesToGroup(groupId: string, expenseIds: string[]): Promise<Group> {
    if (!expenseIds.length) throw new HttpException(400, 'no expenseIds to add');
    //TODO: check for valid expenseIds

    const updateGroupById: Group = await this.groups.findByIdAndUpdate(
      groupId,
      { $push: { expenses: { $each: expenseIds } } },
      { multi: true, new: true },
    );
    if (!updateGroupById) throw new HttpException(409, 'Internal Server Error');

    return updateGroupById;
  }

  public async _removeExpensesFromGroup(groupId: string, expenseIds: string[]): Promise<Group> {
    if (!expenseIds.length) throw new HttpException(400, 'no expenseIds to remove');
    //TODO: check for valid expenseIds

    const updateGroupById: Group = await this.groups.findByIdAndUpdate(
      groupId,
      { $pull: { expenses: { $in: expenseIds } } },
      { multi: true, new: true },
    );
    if (!updateGroupById) throw new HttpException(409, 'Internal Server Error');

    return updateGroupById;
  }

  // TODO: validation for valid userId
  public async _updateBillInGroup(groupId: string, { userId, amount }: { userId: string; amount: number }): Promise<Group> {
    if (!amount) throw new HttpException(400, 'no amount to add');

    const groupData: Group = await this.groups.findById(groupId);
    const billMap = groupData.bill.reduce((acc, curr) => ({ ...acc, [curr.userId]: curr }), {});
    const sharePerUser = (amount / groupData.members?.length).toFixed(2);
    const updatedBill = (groupData.members || []).map(x => {
      if (x == userId) {
        return {
          userId: x,
          repaymentAmount: billMap[x]?.repaymentAmount || 0,
          lendingAmount: (billMap[x]?.lendingAmount || 0) + amount,
        };
      }
      return {
        userId: x,
        repaymentAmount: (billMap[x]?.repaymentAmount || 0) + sharePerUser,
        lendingAmount: billMap[x]?.lendingAmount || 0,
      };
    });
    const updateGroupById: Group = await this.groups.findByIdAndUpdate(groupId, { $set: { bill: updatedBill } }, { new: true });
    if (!updateGroupById) throw new HttpException(409, 'Internal Server Error');

    return updateGroupById;
  }
}

export default GroupService;
