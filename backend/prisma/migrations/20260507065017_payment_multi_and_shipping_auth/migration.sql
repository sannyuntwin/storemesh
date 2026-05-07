-- DropIndex
DROP INDEX "Payment_saleOrderId_key";

-- CreateIndex
CREATE INDEX "Payment_saleOrderId_idx" ON "Payment"("saleOrderId");
