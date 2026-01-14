import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

const QUOTES_API_URL = process.env.QUOTES_API_URL || 'http://localhost:8000';

interface Quote {
  id: number;
  numero: string;
  year: number;
  cliente: string;
  ruc: string;
  proyecto: string;
  total: number;
  filepath: string;
  created_at: string;
}

interface QuotesListResponse {
  quotes: Quote[];
  total: number;
}

@Controller('api/integrations/quotes')
@UseGuards(JwtAuthGuard, WorkspaceAuthGuard, NoPermissionGuard)
export class QuotesIntegrationController {
  
  @Get()
  async listQuotes(
    @Query('year') year?: number,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ): Promise<QuotesListResponse> {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year.toString());
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`${QUOTES_API_URL}/quotes?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }
      
      const data = await response.json() as QuotesListResponse;
      
      // Filtrar por búsqueda si se proporciona
      if (search) {
        const searchLower = search.toLowerCase();
        data.quotes = data.quotes.filter(q => 
          q.cliente?.toLowerCase().includes(searchLower) ||
          q.proyecto?.toLowerCase().includes(searchLower) ||
          q.numero?.includes(search)
        );
        data.total = data.quotes.length;
      }
      
      return data;
    } catch (error) {
      return { quotes: [], total: 0 };
    }
  }

  @Get(':id/download')
  async downloadQuote(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const response = await fetch(`${QUOTES_API_URL}/quotes/${id}/download`);
      if (!response.ok) {
        res.status(404).json({ error: 'Quote not found' });
        return;
      }
      
      const buffer = await response.arrayBuffer();
      const contentDisposition = response.headers.get('content-disposition') || 'attachment; filename="cotizacion.xlsx"';
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', contentDisposition);
      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).json({ error: 'Failed to download quote' });
    }
  }

  @Delete(':id')
  async deleteQuote(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${QUOTES_API_URL}/quotes/${id}`, {
        method: 'DELETE',
      });
      
      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
  }

  @Post('handoff')
  async createHandoff(
    @Body() body: { intent?: string },
    @AuthWorkspace() _workspace: WorkspaceEntity,
    @AuthUser() _user: UserEntity,
  ): Promise<{ redirectUrl: string }> {
    const quotesWebUrl = process.env.QUOTES_WEB_URL || 'http://localhost:5173';
    
    if (body.intent === 'new') {
      return { redirectUrl: quotesWebUrl };
    }
    
    return { redirectUrl: `${quotesWebUrl}/quotes` };
  }
}
