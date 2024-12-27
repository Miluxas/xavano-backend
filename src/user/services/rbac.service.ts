import { Injectable } from "@nestjs/common";

import { Role } from "../types/role.type";

const permissions: {
  [K in Role]: {
    method: string;
    url: string;
    desc: string;
    panelRBAC?: Record<string, string[]>;
    roleBasedFilter?: any;
  }[];
} = {

  User: [
    {
      method: "PUT",
      url: "/users/:userId",
      desc: "The user edits his/her info",
    },
    {
      method: "GET",
      url: "/users/:userId",
      desc: "The user gets his/her info",
    },
    {
      method: "POST",
      url: "/comments",
      desc: "The user add new comment",
    },
    {
      method: "DELETE",
      url: "/comments*",
      desc: "The user delete his/her comment",
      roleBasedFilter: { userId: "$userId" },
    },
    {
      method: "PUT",
      url: "/comments*",
      desc: "The user edit his/her comment",
      roleBasedFilter: { userId: "$userId" },
    },
    {
      method: "GET",
      url: "/comments*",
      desc: "The user get comments",
    },
   
  ],
  Administrator: [
    { method: "*", url: "/*", desc: "The admin has fully permission" },
  ],
};

@Injectable()
export class RBACService {
  public checkAccess(
    role: Role,
    userId: number,
    method: string,
    url: string
  ): { grant: boolean; roleBasedFilter?: any; } {
    if (!role || role.length == 0) return { grant: false };
    const rolePermissions = permissions[role];
    const permission = rolePermissions.find(
      (p) =>
        (p.method == "*" || p.method == method) &&
        this.compareUrls(p.url, url, userId)
    );
    if (permission?.roleBasedFilter) {
      const roleBasedFilter = JSON.parse(
        JSON.stringify(permission.roleBasedFilter).replace(
          '"$userId"',
          userId?.toString()
        )
      );
      return { grant: true, roleBasedFilter };
    }
    return { grant: permission != null };
  }

  private compareUrls(roleUrl: string, url: string, userId: number): boolean {
    if (url.includes("?")) {
      url = url.split("?")[0];
    }
    const roleUrlWithUserId = roleUrl.replace(":userId", userId?.toString());
    if (roleUrlWithUserId == url) return true;
    if (url.startsWith(roleUrl.split("*")[0])) return true;
    const roleUrlParts = roleUrlWithUserId.split("/");
    const urlParts = url.split("/");
    for (let index = 0; index < roleUrlParts.length; index++) {
      if (
        !roleUrlParts[index]?.startsWith(":") &&
        roleUrlParts[index] !== urlParts[index]
      )
        return false;
    }
    return true;
  }

  public getPermissions(role: Role): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    const rolePermissions = permissions[role];
    rolePermissions.forEach((permission) => {
      if (!permission.panelRBAC) {
        return;
      }
      const keys = Object.keys(permission.panelRBAC);
      keys.forEach((entityName) => {
        if (!result[entityName]) {
          Object.assign(result, { [entityName]: [] });
        }
        result[entityName] = Array.from(
          new Set([...result[entityName], ...permission.panelRBAC![entityName]])
        );
      });
    });
    return result
  }
}
