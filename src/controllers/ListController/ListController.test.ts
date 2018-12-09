import request from 'supertest';
import app from '../../app';
import chai from 'chai';
import { ListEntry } from '../../models/ListModel';

const expect = chai.expect;

describe('POST /list with not valid name', () => {
  it('responds with 406', function() {
    request(app)
      .post('/lists')
      .send({ name: 1 })
      .set('Accept', 'application/json')
      .expect(406);
  });
});

let listId: string;

describe('POST /list', () => {
  it('responds with new list with escaped name', function(done) {
    request(app)
      .post('/lists')
      .send({ name: ' testlist<script > ' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(res.body.list).to.be.a('object');
        expect(res.body.list._id).to.be.a('string');
        expect(res.body.list.name).to.be.equal('testlist&lt;script &gt;');
        expect(res.body.list.purchases).to.be.a('array');

        listId = res.body.list._id;

        done();
      });
  });
});

describe('GET /lists', () => {
  it('should return lists including created test list', done => {
    return request(app)
      .get('/lists')
      .expect(200)
      .end((err, res) => {
        expect(res.body.lists)
          .to.be.an('array')
          .that.satisfies((lists: ListEntry[]) => {
            return listId && lists.some(list => list._id === listId);
          });

        done();
      });
  });
});

describe('GET /lists/:id', () => {
  it('should return created test list', done => {
    return request(app)
      .get(`/lists/${listId}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.list).to.be.a('object');
        expect(res.body.list._id)
          .to.be.a('string')
          .that.equals(listId);

        done();
      });
  });
});

describe('GET /lists/nonexistingId', () => {
  it('responds 404', done => {
    return request(app)
      .get(`/lists/nonexistingId`)
      .expect(404, done);
  });
});

describe('DELETE /lists/:id', () => {
  it('responds 200', done => {
    return request(app)
      .delete(`/lists/${listId}`)
      .expect(200, done);
  });
});

describe('GET deleted list', () => {
  it('responds 404', done => {
    return request(app)
      .get(`/lists/${listId}`)
      .expect(404, done);
  });
});

describe('DELETE /lists/nonexistingId', () => {
  it('responds 404', done => {
    return request(app)
      .get(`/lists/nonexistingId`)
      .expect(404, done);
  });
});
