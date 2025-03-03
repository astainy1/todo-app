// Custome 404 response middleware

exports.notFound = (req, res, next) => {
    res.status(404);
    res.render("404", { title: "404 - Not Found" });
  };
  
  // Custome 500 response middleware
  exports.serverError = (err, req, res, next) => {
    if (err) {
      console.error(err.message);
    } else {
      res.status(err.status || 500);
      res.render("500", {
        title: "Server Error",
        message:
          "Sorry for the inconvenience, but there seems to be an issue with our server.",
      });
    }
  };