import zipfile, os

BASE = '/home/u185228347/domains/genz-live.com/hbuilds/versions/019feaa7-11e1-701a-aba7-deada3a8a5c1/nodejs'
ZIP  = os.path.join(BASE, 'next-build.zip')

print('Extracting...')
with zipfile.ZipFile(ZIP, 'r') as z:
    for member in z.namelist():
        # convert backslashes to forward slashes
        target = os.path.join(BASE, member.replace('\\', '/'))
        target_dir = os.path.dirname(target)
        os.makedirs(target_dir, exist_ok=True)
        if not member.endswith('/') and not member.endswith('\\'):
            with z.open(member) as src, open(target, 'wb') as dst:
                dst.write(src.read())

os.remove(ZIP)
print('Done. Triggering restart...')
open(os.path.join(BASE, 'tmp/restart.txt'), 'w').close()
print('Restart triggered OK')
