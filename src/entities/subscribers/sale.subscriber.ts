import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  DataSource,
} from 'typeorm';
import { SaleEntity } from '../sale.entity';
import { ProductEntity } from '../product.entity';

@EventSubscriber()
export class SaleSubscriber implements EntitySubscriberInterface<SaleEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SaleEntity;
  }

  async beforeInsert(event: InsertEvent<SaleEntity>) {
    const productId = event.entity.product?.id;

    await event.manager.transaction(async (transactionalManager) => {
      // lock product
      await transactionalManager.findOne(ProductEntity, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });

      const count = await transactionalManager.count(SaleEntity, {
        where: { product: { id: productId } },
      });

      if (count === 0) {
        event.entity.isFirst = true;
      }
    });
  }
}
