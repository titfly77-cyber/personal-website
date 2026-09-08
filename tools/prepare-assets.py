"""Optional asset preparation: Python + opencv-python + fonttools[woff]."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import os
import urllib.request
import cv2
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
assets = root / 'assets'
cache = Path(os.environ.get('TEMP', '/tmp')) / 'tenghui-font-cache'
cache.mkdir(exist_ok=True)

for name, fraction in [('badge-v1', .25), ('tabletop-v2', .65), ('robot-arm', .25), ('tea-harvesting', .25), ('tea-withering', .25)]:
    cap = cv2.VideoCapture(str(assets / 'videos' / (name + '.mp4')))
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(cap.get(cv2.CAP_PROP_FRAME_COUNT) * fraction))
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError('Could not read video ' + name)
    cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 88])[1].tofile(str(assets / 'images' / (name + '.jpg')))
    cap.release()

characters = set(''.join((root / f).read_text(encoding='utf-8') for f in ['data.js', 'app.js', 'index.html']))

def prepare_font(code):
    family = 'NotoSerif' + code.upper()
    original = cache / (family + '.ttf')
    prefix = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif' + code + '/'
    if not original.exists():
        with urllib.request.urlopen(prefix + family + '%5Bwght%5D.ttf', timeout=60) as response:
            original.write_bytes(response.read())
    with urllib.request.urlopen(prefix + 'OFL.txt', timeout=30) as response:
        (assets / 'fonts' / (family + '-OFL.txt')).write_bytes(response.read())
    font = TTFont(original)
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(text=''.join(characters))
    sub.subset(font)
    font.flavor = 'woff2'
    output = assets / 'fonts' / ('noto-' + code + '.woff2')
    font.save(output)
    print(output.name, output.stat().st_size, flush=True)

with ThreadPoolExecutor(max_workers=2) as executor:
    list(executor.map(prepare_font, ['sc', 'tc']))
print('Prepared local fonts and video posters.')
