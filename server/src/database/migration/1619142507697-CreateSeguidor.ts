import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSeguidor1619142507697 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'seguidor',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'notificar',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'usuario_id',
                    type: 'integer',
                },
                {
                    name: 'seguidor_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'seguidorUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'seguidorSeguidor',
                    columnNames: [ 'seguidor_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
            ],
            uniques: [
                {
                    name: 'usuarioSeguidor',
                    columnNames: [ 'usuario_id', 'seguidor_id' ]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('seguidor');
    }

}
