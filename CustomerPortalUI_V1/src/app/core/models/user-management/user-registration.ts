export class UserRegisration {
    FirstName: string;
    MiddleName: string;
    LastName: string;
	Email: string;
    Password: string;
    ConfirmPassword: string;
    Agree: boolean;

    constructor() {
        this.FirstName = "";
        this.MiddleName = "";
        this.LastName = "";
        this.Email = "";
        this.Password = "";
        this.ConfirmPassword = "";
        this.Agree = false;
    }
}