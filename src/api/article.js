import request from '@/utils/request'
//* 获取文章新闻推荐
export const getArticles = params => {
  return request({
    methods: 'GET',
    url: '/v1_0/articles',
    params
  })
}

//* 获取所有频道
export const getAllChannel = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

//*  添加用户频道
export const addUserChannel = channel => {
  request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
//* 删除指定用户频道
export const delUserChanel = channelId => {
  request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`

  })
}
//* 获取文章详情
export const getArticleId = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

//* 收藏文章
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

//* 取消收藏
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

//* 点赞文章
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}

//* 取消点赞
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}
