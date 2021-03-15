
class SomeSmartContract{
    apply(transaction, blocks){
        blocks.forEach((block)=>{
            block.transactions.forEach((transac)=>{
                // Add code here to compar actual transaction to each transac
            });
        });
    }
}

module.exports = SomeSmartContract;