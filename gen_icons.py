from PIL import Image, ImageDraw, ImageFont
import os

def make_icon(size, path):
    img = Image.new('RGB', (size, size), '#0f2a4a')
    draw = ImageDraw.Draw(img)

    # 배경 원형 액센트
    margin = size * 0.1
    draw.ellipse([margin, margin, size-margin, size-margin], fill='#1a3a5c')

    # 상단 금색 띠
    draw.rectangle([0, 0, size, size*0.08], fill='#e8a020')

    # 텍스트: 韓
    font_size = int(size * 0.42)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        font = ImageFont.load_default()

    text = '韓'
    bbox = draw.textbbox((0,0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(((size-tw)//2, (size-th)//2 - int(size*0.05)), text, fill='#e8a020', font=font)

    # 하단 작은 텍스트
    try:
        small_font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', int(size*0.1))
    except:
        small_font = font
    sub = '윤독확인'
    sbbox = draw.textbbox((0,0), sub, font=small_font)
    sw = sbbox[2] - sbbox[0]
    draw.text(((size-sw)//2, size*0.72), sub, fill='rgba(255,255,255,150)', font=small_font)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, 'PNG')
    print(f'Generated {path}')

make_icon(192, '/home/claude/pwa-app/icons/icon-192.png')
make_icon(512, '/home/claude/pwa-app/icons/icon-512.png')
print('Icons created!')
