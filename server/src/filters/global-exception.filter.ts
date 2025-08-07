export class GlobalExceptionFilter {
  catch(exception: any, host: any) {
    console.error('Global exception:', exception);
    
    const response = host.getResponse();
    
    response.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? exception.message : undefined
    });
  }
}
