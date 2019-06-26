export class SystemUser {
    constructor() {
    }

    Id: number;
    UserType: number;
    UserName: string;
    Email: string;
    PasswordHash: string;
    ContactId: number;
    IsPendingAuthentication: boolean;
    SecurityProfileId: number;
    RequireChangePassword: boolean;
    IsActive: boolean;
    Contact: any;
    UserRoles: number[];
}