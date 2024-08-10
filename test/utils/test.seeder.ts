import { ObjectId } from 'mongodb';
import { add, getCurrentDate } from '@utils/dates';
import { getUniqueId } from '@utils/utils';

export const testSeeder = {
  createUserDto() {
    return {
      login: 'test',
      email: 'test@gmail.com',
      password: '123456789',
    };
  },

  createUserListDto(count: number) {
    return new Array(count).fill(null).map((item, index) => {
      return {
        login: `test${index}`,
        email: `test${index}@gmail.com`,
        password: `123456789${index}`,
        createdAt: getCurrentDate(),
        emailConfirmation: {
          confirmationCode: getUniqueId(),
          expirationDate: add(getCurrentDate(), { hours: 1 }),
          isConfirmed: true,
        },
        _id: new ObjectId(),
      };
    });
  },

  // createDocumentsDto() {
  //   return {
  //     ip: '1',
  //     url: 'url',
  //     date: getCurrentDate(),
  //     _id: new ObjectId(),
  //   };
  // },
  //
  // createDocumentsListDto(count: number) {
  //   return new Array(count).fill(null).map(() => {
  //     return {
  //       ip: '1',
  //       url: 'url',
  //       date: getCurrentDate(),
  //       _id: new ObjectId(),
  //     };
  //   });
  // },
  //
  // createBlogDto(): IBlogSchema {
  //   return {
  //     name: 'Test',
  //     description: 'Test description',
  //     websiteUrl: 'https://string.com',
  //     _id: new ObjectId(),
  //     createdAt: getCurrentDate(),
  //     isMembership: false,
  //   };
  // },
  //
  // createBlogListDto(count: number) {
  //   return new Array(count).fill(null).map((item, i) => {
  //     return {
  //       name: `Test${i}`,
  //       description: `Test description${i}`,
  //       websiteUrl: `https://string${i}.com`,
  //       _id: new ObjectId(),
  //       createdAt: getCurrentDate(),
  //       isMembership: false,
  //     };
  //   });
  // },
  //
  // createPostDto(blogId: string): IPostSchema {
  //   return {
  //     title: 'Nikita',
  //     shortDescription: 'ShortDescription',
  //     content: 'Content',
  //     blogId,
  //     blogName: 'Blog name',
  //     createdAt: getCurrentDate(),
  //     _id: new ObjectId(),
  //   };
  // },
  //
  // createPostListDto(count: number, blogId: string) {
  //   return new Array(count).fill(null).map((item, i) => {
  //     return {
  //       title: `Nikita${i}`,
  //       shortDescription: `ShortDescription${i}`,
  //       content: `Content${i}`,
  //       blogId,
  //       blogName: `Blog name${i}`,
  //       createdAt: getCurrentDate(),
  //       _id: new ObjectId(),
  //     };
  //   });
  // },
  //
  // createCommentDto(userId = new ObjectId().toString(), postId = new ObjectId().toString()): ICommentSchema {
  //   return {
  //     content: 'Content Content Content',
  //     commentatorInfo: {
  //       userId,
  //       userLogin: 'login',
  //     },
  //     postId,
  //     createdAt: getCurrentDate(),
  //     _id: new ObjectId(),
  //   };
  // },
  //
  // createCommentListDto(count: number, userId = new ObjectId().toString(), postId = new ObjectId().toString()) {
  //   return new Array(count).fill(null).map((item, i) => {
  //     return {
  //       content: `Content Content Content${i}`,
  //       commentatorInfo: {
  //         userId,
  //         userLogin: `login${i}`,
  //       },
  //       postId,
  //       createdAt: getCurrentDate(),
  //       _id: new ObjectId(),
  //     };
  //   });
  // },
  //
  // createPostLikeDto() {
  //   return {
  //     createdAt: getCurrentDate(),
  //     status: LikeStatus.LIKE,
  //     authorId: new ObjectId().toString(),
  //     parentId: new ObjectId().toString(),
  //     parentType: ParentType.POST,
  //   };
  // },
  //
  // createPostLikeListDto(count: number, parentId: string, status: LikeStatus, parentType: ParentType, authorId= new ObjectId().toString()): ILikeSchema[] {
  //   return new Array(count).fill(null).map((item, i) => {
  //     return {
  //       _id: new ObjectId(),
  //       createdAt: getCurrentDate(),
  //       status,
  //       authorId,
  //       parentId,
  //       parentType,
  //     };
  //   });
  // },
};
