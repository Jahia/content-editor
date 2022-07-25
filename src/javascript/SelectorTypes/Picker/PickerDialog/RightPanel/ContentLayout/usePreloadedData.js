import {useEffect, useState} from 'react';

const EMPTY_STATE = {totalCount: 0};
const TIMEOUT = 30;

export default ({client, options, tableView, path, pagination}) => {
    const [data, setData] = useState(EMPTY_STATE);

    useEffect(() => {
        async function fetch() {
            try {
                const result = await client.query(options);
                const d = result?.data?.jcr?.nodeByPath?.descendants?.nodes;

                if (d) {
                    setData({
                        totalCount: d.length === 0 ? 0 : result?.data?.jcr?.nodeByPath?.descendants?.pageInfo?.totalCount
                    });
                } else {
                    setData(EMPTY_STATE);
                }
            } catch (e) {
                console.log('Failed to preload data', e);
                setData(EMPTY_STATE);
            }
        }

        setData(EMPTY_STATE);
        setTimeout(() => {
            fetch();
        }, TIMEOUT);
    }, [tableView.viewType, tableView.viewMode, path, pagination.currentPage, pagination.pageSize, client, options]);

    return data;
};
