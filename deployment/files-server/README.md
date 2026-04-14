## Files Server Setup (`files.weddinfo.pl`)

This app uploads images to an external files host using:

- `POST` endpoint: `FILES_UPLOAD_ENDPOINT`
- Bearer token: `FILES_UPLOAD_TOKEN`
- public files base URL: `FILES_PUBLIC_BASE_URL`

### 1) Prepare subdomain

- Create subdomain `files.weddinfo.pl` and point it to your hosting.
- Enable HTTPS certificate.

### 2) Upload script

- Copy `upload.php.example` to your files host as `upload.php`.
- Set a strong secret in `$uploadToken`.
- Make sure `uploads/` directory is writable by PHP.

### 3) Set app env variables (Vercel)

- `FILES_UPLOAD_ENDPOINT=https://files.weddinfo.pl/upload.php`
- `FILES_UPLOAD_TOKEN=<same-secret-as-upload.php>`
- `FILES_PUBLIC_BASE_URL=https://files.weddinfo.pl/uploads`

### 4) Security notes

- Keep token secret and rotate if leaked.
- Restrict upload max size in php.ini / hosting panel.
- Keep MIME validation enabled in script.
- Optionally add origin allowlist if needed.
