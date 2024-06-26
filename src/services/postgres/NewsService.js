const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * news servise
 */
class NewsService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {object} param0
   * @param {string} uploader
   */
  async addNews({title, body, category}, uploader) {
    const id = `news-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO news (id, title, body, category, uploader)
              VALUES($1, $2, $3, $4, $5)
              RETURNING id, title`,
      values: [id, title, body, category, uploader],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Berita gagal ditambahkan');
    }

    return {
      id: result.rows[0].id,
      title: result.rows[0].title,
    };
  }

  /**
   * get all news
   */
  async getAllNews() {
    const query = {
      text: `SELECT news.id, news.title, news.body, news.category,
              news.image, news.is_public, news.views, news."createdAt",
              news."updatedAt", users.username AS uploader 
              FROM news INNER JOIN users 
              ON news.uploader = users.id
              ORDER BY "updatedAt" DESC`,
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
  /**
   * @param {string} id
   */
  async getNewsById(id) {
    const query = {
      text: `SELECT news.id, news.title, news.body, news.category,
      news.image, news.is_public, news.views, news."createdAt",
      news."updatedAt", users.username AS uploader 
      FROM news INNER JOIN users 
      ON news.uploader = users.id
      WHERE news.id = $1
      ORDER BY news."updatedAt" DESC`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Berita tidak tersedia');
    }
    return result.rows[0];
  }

  /**
   * @param {object} param0
   */
  async getNewsByCategory({category}) {
    const query = {
      text: `SELECT news.id, news.title, news.body, news.category,
      news.image, news.is_public, news.views, news."createdAt",
      news."updatedAt", users.username AS uploader 
      FROM news INNER JOIN users 
      ON news.uploader = users.id
      WHERE category = $1
      ORDER BY news."updatedAt" DESC`,
      values: [category],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }


  /**
   * @param {string} id
   * @param {object} param1
   */
  async putNews(id, {title, body, category}) {
    const query = {
      text: `UPDATE news SET title = $2, body = $3,
              category = $4, "updatedAt" = current_timestamp
              WHERE id = $1
              RETURNING id, title`,
      values: [id, title, body, category],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Berita tidak tersedia');
    }

    return result.rows[0];
  }
  /**
   * @param {string} id
   */
  async verifyNewsId(id) {
    const query = {
      text: 'SELECT * FROM news WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Berita tidak tersedia');
    }
  }

  /**
   * @param {string} id
   */
  async deleteNews(id) {
    const query = {
      text: 'DELETE FROM news WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} id
   */
  async updateViews(id) {
    const queryGet = {
      text: 'SELECT views FROM news WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(queryGet);
    const currentViews = result.rows[0].views + 1;
    const query = {
      text: `UPDATE news SET views = $2
              WHERE id = $1`,
      values: [id, currentViews],
    };
    await this._pool.query(query);
  }
}

module.exports = NewsService;
