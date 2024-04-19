import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../../environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userDataSource = new BehaviorSubject<User>({
    user: {
      id: "",
      userName: "",
      email: "",
      phoneNumber: "",
    },
    roles: [],
  });
  currentUser = this.userDataSource.asObservable();

  AllUsersApiUrl = environment.getAllUsersApiUrl;
  UserByIdApiUrl = environment.getUserByIdApiUrl;
  ChangePasswordApiUrl = environment.changePasswordApiUrl;
  ForgotPasswordApiUrl = environment.forgotPasswordApiUrl;
  UpdateInformationApiUrl = environment.updateUserApiUrl;
  CheckUserOrEmailExistApiUrl = environment.checkUserOrEmailExistApiUrl;
  constructor(private http: HttpClient) {}

  ////ADMIN USER MANAGEMENT
  getAllUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.AllUsersApiUrl);
  }
  getUserById(id: string): Observable<userWithRoles> {
    const user = this.http.get<userWithRoles>(this.UserByIdApiUrl(id));
    user.subscribe((currUser) => {
      const userObj = {
        user: {
          id: currUser.userWithRoles.user.id,
          userName: currUser.userWithRoles.user.userName,
          email: currUser.userWithRoles.user.email,
          phoneNumber: currUser.userWithRoles.user.phoneNumber,
        },
        roles: currUser.userWithRoles.roles,
      };

      this.userDataSource.next(userObj);
    });

    return user;
  }
  updateInfo(
    id: string,
    user: UpdateUserByAdminObj,
  ): Observable<UpdateUserByAdminObj> {
    return this.http.put<UpdateUserByAdminObj>(
      this.UpdateInformationApiUrl(id),
      user,
    );
  }
  checkUserOrEmailExists(username: string, email: string): Observable<boolean> {
    return this.http.get<boolean>(this.CheckUserOrEmailExistApiUrl);
  }

  ////USER INFORMATION

  updateMyInfo(id: string, user: UpdateMyProfileObj): Observable<any> {
    return this.http.put(this.UpdateInformationApiUrl(id), user);
  }
  changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Observable<ChangePasswordObj> {
    const changePasswordModel = {
      userId: id,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    return this.http.put<ChangePasswordObj>(
      `${this.ChangePasswordApiUrl(id)}`,
      changePasswordModel,
    );
  }
  resetPassword(email: string): Observable<any> {
    let params = new HttpParams().set("email", email);
    return this.http.get(this.ForgotPasswordApiUrl, { params });
  }
  resetPasswordWithToken(resetPasswordWithToken: ResetPasswordWithTokenObj) {
    return this.http.post(
      environment.resetPasswordApiUrl,
      resetPasswordWithToken,
    );
  }
}
export type UserObj = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
};
export type User = {
  user: UserObj;
  roles: string[];
};

export type userWithRoles = {
  userWithRoles: User;
};
export type ApiResponse = {
  users: UserObj[];
  error: "";
};
export type ChangePasswordObj = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};
export type ResetPasswordWithTokenObj = {
  email: string;
  NewPassword: string;
  ConfirmPassword: string;
  Token: string;
};

export type UpdateUserByAdminObj = {
  userId: string;
  userName: string;
  email: string;
  role: string;
  phoneNumber: string;
  password: string;
};
export type UpdateMyProfileObj = {
  userName: string;
  phoneNumber: string;
  password: string;
};
