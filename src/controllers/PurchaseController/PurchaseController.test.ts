import request from 'supertest';
import app from '../../app';
import chai from 'chai';
import { PurchaseModel } from '../../models/PurchaseModel';

const expect = chai.expect;

let listId: string;
let purchaseId: string;

describe('create list', () => {
  it('get list id', function(done) {
    request(app)
      .post('/lists')
      .send({})
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(res.body.list).to.be.a('object');
        expect(res.body.list._id).to.be.a('string');

        listId = res.body.list._id;

        done();
      });
  });
});

describe('create invalid purchase', () => {
  it('responds with validation error', function(done) {
    request(app)
      .post(`/lists/${listId}/purchases`)
      .send({ bought: 'asdf', number: 'asdf' })
      .set('Accept', 'application/json')
      .expect(406)
      .end((err, res) => {
        const { errors } = res.body;
        expect(errors).to.be.an('array');

        const hasParamName = (name: string) => (error: any) =>
          error.param === name;

        const checkHasParamError = (name: string) => {
          if (!errors.some(hasParamName(name))) {
            throw new Error(
              `error param ${name} not found in responded errors`,
            );
          }
        };

        ['name', 'number', 'bought'].forEach(checkHasParamError);

        done();
      });
  });
});

describe('create purchase', () => {
  it('responds with purchase', function(done) {
    request(app)
      .post(`/lists/${listId}/purchases`)
      .send({ name: ' testpurchase <script />' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(res.body.purchase).to.be.a('object');
        const { purchase } = res.body;
        expect(purchase._id).to.be.a('string');
        expect(purchase.name).to.be.equal('testpurchase &lt;script &#x2F;&gt;');
        expect(purchase.bought)
          .to.be.a('boolean')
          .that.equals(false);
        expect(purchase.number)
          .to.be.a('number')
          .that.equals(1);

        purchaseId = purchase._id;

        done();
      });
  });
});

describe('update purchase', () => {
  it('responds with updated purchase', function(done) {
    request(app)
      .patch(`/lists/${listId}/purchases/${purchaseId}`)
      .send({ name: ' edited <script />', bought: true, number: 3 })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(res.body.purchase).to.be.a('object');
        const { purchase } = res.body;
        expect(purchase._id).to.be.a('string');
        expect(purchase.name).to.be.equal('edited &lt;script &#x2F;&gt;');
        expect(purchase.bought)
          .to.be.a('boolean')
          .that.equals(true);
        expect(purchase.number)
          .to.be.a('number')
          .that.equals(3);

        purchaseId = purchase._id;

        done();
      });
  });
});

describe('update purchase with invalid values', () => {
  it('responds with validation errors', function(done) {
    request(app)
      .patch(`/lists/${listId}/purchases/${purchaseId}`)
      .send({ name: false, bought: 'asdf', number: 'asdf' })
      .set('Accept', 'application/json')
      .expect(406)
      .end((err, res) => {
        const { errors } = res.body;
        expect(errors).to.be.an('array');

        const hasParamName = (name: string) => (error: any) =>
          error.param === name;

        const checkHasParamError = (name: string) => {
          if (!errors.some(hasParamName(name))) {
            throw new Error(
              `error param ${name} not found in responded errors`,
            );
          }
        };

        ['name', 'number', 'bought'].forEach(checkHasParamError);

        done();
      });
  });
});

describe('delete list with purchase', () => {
  it('responds with 200', function(done) {
    request(app)
      .delete(`/lists/${listId}`)
      .expect(200, done);
  });
});

describe('get deleted list with purchase', () => {
  it('responds 404', function(done) {
    request(app)
      .get(`/lists/${listId}`)
      .expect(404, done);
  });
});

describe('check purchase deleted when list deleted', () => {
  it('purchase model returns null', async function(done) {
    const purchase = await PurchaseModel.findOne({ _id: purchaseId });

    expect(purchase).to.be.a('null');
    done();
  });
});
