let DataBase = require('../routes/db');

module.exports = function(app, config, router) {
    router.get('/getCommentsModule', async function (req, res, next) {
        try {
            const [module_row, module_fields] = await DataBase.Execute('select modules.title from modules where modules.id = ? ', [req.query.id]);
            const [comments_list, comments_fields] = await DataBase.Execute('select * from comments_module where module_id = ? ', [req.query.id]);
            res.json({
                error: false,
                title: module_row[0].title,
                commentsList: comments_list
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }

    });
    router.put('/putCommentsActive', async function (req, res, next) {
        try {
            await DataBase.Execute('update comments_module set active = ? where module_id = ? AND id = ?', [req.body.value, req.body.id, req.body.comment_id]);
            res.json({
                error: false
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });
    router.put('/putModuleSort', async function (req, res, next) {
        try {
            if (req.body.start !== req.body.end && req.body.id && (req.body.start || req.body.start === 0) && (req.body.end || req.body.end === 0) ) {
                if (req.body.start < req.body.end) {
                    await DataBase.Execute('update modules set sortIndex = (modules.sortIndex - 1) where sortIndex > ? AND sortIndex <= ?', [req.body.start, req.body.end]);
                } else if (req.body.start > req.body.end) {
                    await DataBase.Execute('update modules set sortIndex = (modules.sortIndex + 1) where sortIndex >= ? AND sortIndex < ?', [req.body.end, req.body.start]);
                }
                await DataBase.Execute('update modules set sortIndex = ? where id = ?', [req.body.end, req.body.id]);
            }
            res.json({
                error: false
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }

    });
    router.post('/postModule', async function (req, res, next) {
        try {
            await DataBase.Execute('update modules set title = ? where id = ?', [req.body.title, req.body.id]);
            if (req.body.content) {
                await DataBase.Execute('update text_module set content = ? where module_id = ?', [req.body.content, req.body.id]);
            }
            res.json({
                error: false
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });
    router.get('/getTextModuleList', async function (req, res, next) {
        try {
            const [menu_row, menu_fields] = await DataBase.Execute('select modules.title, modules.id, modules.type, modules_type.type as typeName, modules.speed, modules.bg from modules left join modules_type on modules.type = modules_type.id order by modules.sortIndex', []);
            res.json({
                error: false,
                menuList: menu_row
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });
    router.get('/getGalleryItems', async function (req, res, next) {
        try {
            const [gallery_items, content_fields] = await DataBase.Execute('select * from gallery_module ORDER BY RAND() limit ?', [req.query.count || 12]);
            res.json({
                error: false,
                items: gallery_items
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });
    router.get('/getTextModule', async function (req, res, next) {
        try {
            const [content_row, content_fields] = await DataBase.Execute('select modules.id, modules.title, text_module.content from modules left join text_module on text_module.module_id = modules.id where modules.id = ? ', [req.query.id]);
            res.json({
                error: false,
                item: content_row[0]
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }

    });

    router.get('/getComments', async function (req, res, next) {
        try {
            const [comments, content_fields] = await DataBase.Execute('select * from comments_module where active = 1 ORDER BY RAND() limit ?', [req.query.count || 3]);
            res.json({
                error: false,
                comments: comments
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }

    });
    router.get('/getPlaces', async function (req, res, next) {
        if (!req.query.search) {
            res.json({
                error: false,
                items: []
            });
            return;
        }
        try {
            const [places, places_fields] = await DataBase.Execute(`
                select distinct * from (
                    (
                        select name as value, name as label from map_city where name like ? order by name limit 5
                    ) union (
                        select name as value, name as label from map_country where name like ? order by name limit 5
                    )
                ) as un order by value limit 5
            `, ['%' + req.query.search + '%', '%' + req.query.search + '%']);
            res.json({
                error: false,
                items: places
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });

    router.get('/getCities', async function (req, res, next) {
        if (!req.query.search) {
            res.json({
                error: false,
                items: []
            });
            return;
        }
        try {
            const [places, places_fields] = await DataBase.Execute(`
                select distinct name as value, name as label from map_city where name like ? order by name limit 5
            `, ['%' + req.query.search + '%']);
            res.json({
                error: false,
                items: places
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });
    router.get('/getCountries', async function (req, res, next) {
        if (!req.query.search) {
            res.json({
                error: false,
                items: []
            });
            return;
        }
        try {
            const [places, places_fields] = await DataBase.Execute(`
                select name as value, name as label from map_country where name like ? order by name limit 5
            `, ['%' + req.query.search + '%']);
            res.json({
                error: false,
                items: places
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });
    router.post('/postComment', async function (req, res, next) {
        if (!req.body.name || !req.body.text || !req.body.module_id ) {
            return res.json({
                error: true,
                exception: "empty field"
            });
        }

        try {
            const [comments, content_fields] = await DataBase.Execute('insert into comments_module (name, text, module_id) values (?, ?, ?)', [req.body.name, req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br>'), req.body.module_id]);
            res.json({
                error: false
            });
        } catch (ex) {
            console.warn(ex);
            res.json({
                error: true,
                exception: ex
            });
        }
    });


    router.post('/postForm', async function (req, res, next) {
        console.log(JSON.stringify(req.body));
        return res.json({
            error: false,
        });
    });

    return router;
};