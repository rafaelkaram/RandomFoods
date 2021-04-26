import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMedida1615734933551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'medida',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nome',
                    type: 'varchar',
                    length: '15'
                },
                {
                    name: 'valor',
                    type: 'integer'
                },
                {
                    name: 'tipo_unidade',
                    enumName: 'tipo_unidade_enum',
                    type: 'enum',
                    enum: [
                        'VOLUME',
                        'PESO',
                        'UNIDADE'
                    ]
                },
            ],
            uniques: [
                {
                    name: 'nomeTipoUnidade',
                    columnNames: [ 'nome', 'tipo_unidade' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('medida');
    }

}