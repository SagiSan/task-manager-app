// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-github2';
// import { AuthService } from './auth.service'; // Assuming you have an AuthService to handle logic

// @Injectable()
// export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
//   constructor(private authService: AuthService) {
//     super({
//       clientID: process.env.GITHUB_CLIENT_ID, // Your GitHub Client ID
//       clientSecret: process.env.GITHUB_CLIENT_SECRET, // Your GitHub Client Secret
//       callbackURL: 'http://localhost:3000/auth/github/callback', // Your GitHub callback URL
//       scope: ['user:email'],
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any) {
//     // Handle the profile and create or update user in your database
//     const user = await this.authService.validateOAuthLogin(profile);
//     return user;
//   }
// }
