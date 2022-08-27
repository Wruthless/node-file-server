# node-file-server

A file server for various file types in node. If you wish to add more supported file types simply add to the `switch` statement on line 47:

<pre>
switch(path.extname(filename)) {
    case ".html":
    case ".htm": type = "text/html"; break;
    case ".js": type = "text/javascript"; break;
    case ".css": type = "text/css"; break;
    case ".png": type = "image/png"; break;
    case ".txt": type = "text/plain"; break;
    default:    type = "application/octet-stream"; break
}
</pre>

The directory from which files are served is set to `./serve` by default, you can change this hardcoded value or you can supply CLI arguments. This is all done in the final line of code.

<pre>
serve(process.argv[2] || "./serve", parseInt(process.argv[3]) || 8000);
</pre>

I have included the default directory with some throw-a-way files for testing.
