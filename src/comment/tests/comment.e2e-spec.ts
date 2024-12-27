import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { CommentStatus } from '../entities';

describe(' Comment Tests ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let adminToken='';
  it('should allow admin user login', async () => { 
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password:'123123'
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.firstName).toEqual('superAdmin');
        expect(resultObject.data.user.password).toBeUndefined();
        adminToken=resultObject.data.token;
      });
  });

  let firstUserToken='';
  it('should allow first user login', async () => { 
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user1@test.com',
        password:'123123'
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.firstName).toEqual('user1');
        expect(resultObject.data.user.password).toBeUndefined();
        firstUserToken=resultObject.data.token;
      });
  });

  let secondUserToken='';
  it('should allow second user login', async () => { 
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user2@test.com',
        password:'123123'
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.firstName).toEqual('user2');
        expect(resultObject.data.user.password).toBeUndefined();
        secondUserToken=resultObject.data.token;
      });
  });

  it('should return an empty list of comments for first user', async () => {
    return agent(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items.length).toEqual(0); 
      });
  });

let parentId:number;
  it('should allow a first user to add a comment', async () => {
    return agent(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        content: 'This is a test comment',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.content).toEqual('This is a test comment');
        parentId=resultObject.data.id;
      });
  });

  it('should return a list of comments for first user', async () => {
    return agent(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items.length).toEqual(1); 
        expect(resultObject.data.pagination.totalItems).toEqual(1); 
      });
  });

  it('should return an empty list of comments for second user', async () => {
    return agent(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items.length).toEqual(0); 
      });
  });

  let commentId:number;
  it('should allow a user to add a nested comment', async () => {
    return agent(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        content: 'This is a nested comment',
        parentId,
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.content).toEqual('This is a nested comment');
        expect(resultObject.data.parentId).toEqual(parentId);
        commentId=resultObject.data.id;
      });
  });

  it('should not allow a user to edit another user\'s comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${secondUserToken}`)   
      .send({
        content: 'This is an updated nested comment',
      })
      .expect(403);
  }); 

  it('should allow a user to edit their own comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)   
      .send({
        content: 'This is an updated nested comment',
      })
      .expect(200);
  });

  it('should not allow a user to delete another user\'s comment', async () => {
    return agent(app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(403);
  }); 

  it('should allow a user to delete their own comment', async () => {
    return agent(app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .expect(200);
  });

  it('should allow an admin to delete any comment', async () => {
    return agent(app.getHttpServer())
      .delete(`/comments/${parentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should allow a user to add a comment', async () => {
    return agent(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        content: '1 This is a test comment',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.content).toEqual('1 This is a test comment');
      });
  });

  
let content2Id:number;
it('should allow a user to add a comment', async () => {
    return agent(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        content: '2 This is a test comment',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.content).toEqual('2 This is a test comment');
        content2Id=resultObject.data.id;
      });
  });
let content3Id:number;
  it('should allow a user to add a comment', async () => {
    return agent(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        content: '3 This is a test comment',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.content).toEqual('3 This is a test comment');
        content3Id=resultObject.data.id;
      });
  });

  it('should allow a user to add a comment', async () => {
    return agent(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        content: '4 This is a test comment',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.content).toEqual('4 This is a test comment');
      });
  });

  it('should allow an admin to approve any comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/approve/${content3Id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.APPROVED); 
      });
  });

  it('should allow a user to get their own comment', async () => {
    return agent(app.getHttpServer())
      .get(`/comments/${content3Id}`)
      .set('Authorization', `Bearer ${firstUserToken}`)   
      .expect(200) 
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.APPROVED); 
      });
  });

  it('should allow a user to edit their own comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/${content3Id}`)
      .set('Authorization', `Bearer ${firstUserToken}`)   
      .send({
        content: 'This is an updated comment',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.PENDING); 
      });
  });

  it('should allow a user to get their own comment', async () => {
    return agent(app.getHttpServer())
      .get(`/comments/${content3Id}`)
      .set('Authorization', `Bearer ${firstUserToken}`)   
      .expect(200) 
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.PENDING); 
      });
  });

  it('should allow a user to get their own comment', async () => {
    return agent(app.getHttpServer())
      .get(`/comments/${content3Id}`)
      .set('Authorization', `Bearer ${firstUserToken}`)   
      .expect(200) 
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.PENDING); 
      });
  });

  it('should allow an admin to approve any comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/approve/${content2Id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.APPROVED); 
      });
  });

  it('should return list of comments for second user', async () => {
    return agent(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items[0].id).toEqual(content2Id); 
      });
  });
  
  it('should allow an admin to disapprove any comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/disapprove/${content3Id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.DISAPPROVED); 
      });
  });

  it('should allow an admin to disapprove any comment', async () => {
    return agent(app.getHttpServer())
      .put(`/comments/disapprove/${content2Id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.status).toEqual(CommentStatus.DISAPPROVED); 
      });
  });

  it('should return list of comments for second user', async () => {
    return agent(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.pagination.totalItems).toEqual(0); 
      });
  });
});
