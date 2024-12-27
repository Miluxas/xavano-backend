import { BaseModel } from "@/common/base-model";
import { AfterLoad, Column, Entity, Index } from "typeorm";
import { Role } from "../types/role.type";

@Entity()
@Index(["firstName", "lastName"], { fulltext: true })
export class User extends BaseModel {
  @Column({ length: 80 })
  firstName: string = "";

  @Column({ length: 80 })
  lastName: string = "";

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true })
  active: boolean = true;

  @Column({ default: false })
  emailVerified: boolean = false;

  @Column({ default: false })
  isDeleted: boolean = false;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true })
  parentalPin?: string;

  @Column()
  role: Role = "User";

  @Column({ default: "App" })
  userType: "Panel" | "App" = "App";

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true, type: "text" })
  deleteReason?: string;

  @Column({ default: false })
  isTrialUsed: boolean = false;

  state: string = "";

  hasSubscription?: boolean;

  hasProfile?: boolean;

  @AfterLoad()
  afterLoad() {
    this.state = this.active ? "Enable" : "Disable";
  }
}
