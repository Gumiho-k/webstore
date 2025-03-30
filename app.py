# test on development server: http://127.0.0.1:5000

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# 模擬產品數據（之後可以替換為真實的數據庫）
products = [
    {
        'id': 1,
        'name': '產品一',
        'description': '這是一個非常優質的產品，具有多種功能和特色。',
        'price': 1000,
        'image': 'product1.png',
        'specifications': [
            '材質：高級材料',
            '尺寸：30x40cm',
            '重量：500g',
            '產地：台灣'
        ],
        'category': '分類一'
    },
    {
        'id': 2,
        'name': '產品二',
        'description': '這是我們最受歡迎的產品之一，品質保證。',
        'price': 2000,
        'image': 'product2.jpg',
        'specifications': [
            '材質：進口材料',
            '尺寸：25x35cm',
            '重量：300g',
            '產地：日本'
        ],
        'category': '分類二'
    }
]

# 添加分類功能
@app.route('/category/<category>')
def category(category):
    category_products = [p for p in products if p['category'] == category]
    return render_template('category.html', 
                         category=category, 
                         products=category_products)

@app.route('/')
def home():
    return render_template('index.html', products=products)

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


if __name__ == '__main__':
    app.run(debug=True)