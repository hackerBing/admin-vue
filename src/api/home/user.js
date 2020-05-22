import service from '../service'

export const getHomeOnlineUserList = params => {
    return service({
        url: 'api/getHomeOnlineUserList',
        method: "post",
        data: params
    });
};

