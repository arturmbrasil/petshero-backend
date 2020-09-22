import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateCampaigns1600815775971
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'campaigns',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'ong_id',
            type: 'uuid',
          },
          {
            name: 'animal_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'target_value',
            type: 'DECIMAL(19,2)',
          },
          {
            name: 'received_value',
            type: 'DECIMAL(19,2)',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'activated',
            type: 'boolean',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'campaigns',
      new TableForeignKey({
        name: 'CampaignOng',
        columnNames: ['ong_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'campaigns',
      new TableForeignKey({
        name: 'CampaignOngAnimal',
        columnNames: ['animal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ong_animals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('campaigns', 'CampaignOngAnimal');
    await queryRunner.dropForeignKey('campaigns', 'CampaignOng');
    await queryRunner.dropTable('campaigns');
  }
}
