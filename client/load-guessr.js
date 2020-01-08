$.ajax({
    url: "random.html",
    success: function (data) {
        let newDoc = document.open("text/html", "replace");
        newDoc.write(data);
        newDoc.close();

    },
    dataType: 'html'
});