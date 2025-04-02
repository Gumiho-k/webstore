# test on development server

from flask import Flask, render_template, request, jsonify, flash, redirect, url_for

app = Flask(__name__)

# 產品數據
products = [
    {
        'id': 1,
        'name': '客製化名牌',
        'description': '個人化設計的3D列印名牌，可選擇不同字體和樣式。適合辦公桌、門牌或活動使用。',
        'price': '50+',
        'image': 'nameplate.jpg',
        'specifications': [
            '材質：PLA環保材料',
            '尺寸：20x5cm（可客製）',
            '厚度：4mm',
            '可選顏色：10種',
            '製作時間：2-3天'
        ],
        'category': '個人配件'
    },
    {
        'id': 2,
        'name': '3D文字吊飾',
        'description': '客製化3D文字吊飾，可選擇任意文字組合。完美的個人化禮物選擇。',
        'price': '30+',
        'image': 'keychain.jpg',
        'specifications': [
            '材質：PLA METAL 耐用材料',
            '尺寸：最大8x3cm',
            '厚度：3mm',
            '可選顏色：黑、白、黃、藍、紅、紫、熒光(黃)',
            '製作時間：1-2天'
        ],
        'category': '飾品'
    }
]

# 添加分類
categories = [
    '個人配件',
    '飾品',
    '居家擺設',
    '辦公用品',
    '客製化設計'
]

# 添加分類功能
@app.route('/category/<category>')
def category(category):
    category_products = [p for p in products if p['category'] == category]
    return render_template('category.html', 
                         category=category, 
                         products=category_products,
                         categories=categories)

@app.route('/')
def home():
    return render_template('index.html', 
                         products=products, 
                         categories=categories)

@app.route('/product/<int:product_id>')
def product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    return render_template('product.html', product=product)

@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    if not query:
        return render_template('search.html', products=[], query='')
    
    search_results = [
        product for product in products
        if query in product['name'].lower() or 
           query in product['description'].lower() or
           query in product['category'].lower()
    ]
    return render_template('search.html', 
                         products=search_results, 
                         query=query)

@app.route('/api/search')
def api_search():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    
    search_results = [
        product for product in products
        if query in product['name'].lower() or 
           query in product['description'].lower() or
           query in product['category'].lower()
    ]
    return jsonify(search_results)

# 確保這個路由在文件中
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        product_interest = request.form.get('product_interest')
        
        # 這裡可以添加發送郵件的功能
        # 目前只是返回成功訊息
        return render_template('contact_success.html', 
                            name=name,
                            categories=categories)
    
    return render_template('contact.html', 
                         categories=categories,
                         products=products)

if __name__ == '__main__':
    app.run(debug=True)