const StoriesService = require('../stories/stories-service');

async function checkChapterExists(req, res, next) {
    try {
        const chapter = await StoriesService.getByChapterNumber(
            req.app.get('db'),
            req.params.chapter_number
        );

        if (!chapter) {
            return res.status(404).json({
                error: { message: `Chapter doesn't exist` },
            });
        }

        res.chapter = chapter;
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = { 
    checkChapterExists,
};
