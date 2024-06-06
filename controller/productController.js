const Product = require("../Model/Product");

const productContoller = {}


//상품 생성
productContoller.createProduct = async (req, res) => {
	try {
		const { sku, name, size,
			image, category, description,
			price, stock, status } = req.body;

		const product = new Product({
			sku, name, size,
			image, category, description,
			price, stock, status
		});

		await product.save();
		res.status(200).json({ status: "Success - create product" });
	} catch (error) {
		res.status(400).json({ status: "Fail - create product" })
	}
};

//상품 조회
productContoller.getProducts = async (req, res) => {

	try {
		//전체 상품 조회
		const product = await Product.find({})
		//조회한 결과를 보내주기
		res.status(200).json({ status: "Success get Products", data: product });
	} catch (error) {
		res.status(400).json({ status: "Fail get Products", error: error.message });
	}

}

module.exports = productContoller